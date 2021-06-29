const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dt1b4wuyh/image/upload/v1624899576/Tack/default-avatar_omsqin.jpg",
  },
});

mongoose.model("User", userSchema);
