const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const Post = require("../../models/post");
const User = require("../../models/user");
const TokenGenerator = require("../../models/token_generator");
const JWT = require("jsonwebtoken");
let token;

describe("/posts", () => {
<<<<<<< HEAD
  beforeAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    const user = new User({
      email: "test@test.com",
      password: "12345678",
      username: "username",
    });
=======
  beforeAll( async () => {
    const user = new User({email: "test@test.com", password: "12345678", username: "username"});
>>>>>>> 1524a06 (first commit for this branch)
    await user.save();
    token = TokenGenerator.jsonwebtoken(user.id);
  });

  beforeEach(async () => {
    await Post.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("POST, when token is present", () => {
    test("responds with a 201", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("hello world");
    });

    test("returns a new token", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat > originalPayload.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      await request(app).post("/posts").send({ message: "hello again world" });
      let posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("returns every post in the collection", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      let messages = response.body.posts.map((post) => post.message);
      expect(messages).toEqual(["howdy!", "hola!"]);
    });

    test("the response code is 200", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      expect(response.status).toEqual(200);
    });

    test("returns a new token", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat > originalPayload.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("returns no posts", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app).get("/posts");
      expect(response.body.posts).toEqual(undefined);
    });

    test("the response code is 401", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app).get("/posts");
      expect(response.status).toEqual(401);
    });

    test("does not return a new token", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app).get("/posts");
      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("returns every post in the collection with time added", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });

      let messages = response.body.posts.map((post) => [
        post.message,
        post.createdAt,
      ]);

      expect(messages[0][1]).not.toEqual(undefined);
      expect(messages[1][1]).not.toEqual(undefined);
    });
  });

  describe("DELETE, when post is no longer wanted", () => {
    test("delete selected post and update list to correct amount", async () => {
      let post1 = new Post({ message: "howdy!" });
      await post1.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });

      let posts = response.body.posts.map((post) => [post._id]);

      const Post_ID = posts[0];
      // console.log("chris" + posts)
      let response2 = await request(app)
        .delete("/posts")
        .set({ Post_ID: Post_ID })
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      let refreshed_posts = await Post.find();
      expect(response2.statusCode).toBe(200);
      expect(refreshed_posts.length).toEqual(0);
    });
  });
});
