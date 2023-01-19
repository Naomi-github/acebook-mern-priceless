const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

UserSchema.statics.signup = async function(email, password, username) {

  const exists = await this.findOne({email})
  const usernameExists = await this.findOne({username})

  if (exists) {
<<<<<<< HEAD
    
    throw Error('Email already in use')
  }
=======
    throw Error('Email already in use')
  } 
>>>>>>> 1524a06 (first commit for this branch)
  else if (usernameExists) {
    throw Error('Username already in use')
  }

  const user = await this.create({email, password, username})

  return user
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
