const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");
const product = require("./product");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

userSchema.plugin(passportlocalmongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
