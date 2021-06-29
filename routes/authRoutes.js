const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("./../config/keys");
const { authMiddleware } = require("./../middlewares/authMiddleware");
// const authMiddleware = require("./../middlewares/authMiddleware");

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please, fill in all the fields" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "This email address is already taken. Please use another one.",
        });
      }
      bcrypt.hash(password, 12).then((hashed_password) => {
        const user = new User({
          name,
          email,
          password: hashed_password,
          pic,
        });
        // console.log("user within /signup before .save", user);
        user
          .save()
          .then((user) => {
            user.password = undefined;
            res.status(201).json({
              message: "You've been successfully signed up. Now, log in!",
              user,
            });
          })
          .catch((err) => {
            // res.status(400).json({
            //   message: "An error occured. Please sign up later",
            // });
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // console.log("email, password", email, password);
  if (!email || !password) {
    return res.status(422).json({
      error: "Please fill in all the fields.",
    });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({
        error: "Invalid email or password.",
      });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({
          //   message: "User successfully signed in.",
          // });
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET_KEY);
          const firstName = savedUser.name
            .trim()
            .split(" ")[0]
            .replace(/^\w/, (c) => c.toUpperCase());
          const { _id, name, email, followers, following, pic } = savedUser;
          savedUser.password = undefined;
          savedUser.firstName = firstName;
          // console.log("savedUser within /login", savedUser);
          return res.status(200).json({
            message: `Welcome back, ${firstName}.`,
            token,
            user: savedUser,
            pic,
          });
        } else {
          return res.status(422).json({
            error: "Invalid email or password.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/protected", authMiddleware, (req, res) => {
  res.send("within protected");
});

module.exports = router;
