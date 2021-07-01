const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET_KEY,
  SENDGRID_API_KEY,
  EMAIL_FROM,
} = require("./../config/keys");
const { authMiddleware } = require("./../middlewares/authMiddleware");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API_KEY,
    },
  })
);

router.post("/signup", (req, res) => {
  // console.log("SENDGRID_API_KEY", SENDGRID_API_KEY);
  // console.log("EMAIL_FROM", EMAIL_FROM);

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
        const firstName = user.name
          .trim()
          .split(" ")[0]
          .replace(/^\w/, (c) => c.toUpperCase());
        user.firstName = firstName;
        // console.log("user within /signup before .save", user);
        user
          .save()
          .then((user) => {
            user.password = undefined;

            const emailData = {
              from: EMAIL_FROM,
              to: user.email,
              subject: `Tack - Welcome ${user.firstName}`,
              html: `<h1>Hi ${user.firstName}</h1>
              <p>You can now : </p>
              <br/>
               <p>- Create your Tacks, </p> 
               <br/> 
               <p>- Discover all the Tacks</p>
               <br/>
               <p>- Follow our users</p>`,
            };

            // sgMail
            //   .send(emailData)
            //   .then((sent) => {
            //     console.log("Email sent!!", sent);
            //     // return res.json({
            //     //   message: `An email has been sent to ${user.email}.`,
            //     // });
            //   })
            //   .catch((err) => {
            //     console.log("Email sent error", err);
            //     return res.json({
            //       message: err.message,
            //     });
            //   });

            transporter
              .sendMail({
                to: user.email,
                from: EMAIL_FROM,
                subject: `Tack - Welcome ${user.firstName}`,
                html: `
                <h2 style="color:white; background-color: #546e7a; text-align: center">Hi ${user.firstName}</h2>
                <p>Welcome to Tack!</p>
              <p>You can now : </p>
              <p> </p>
               <p>- Create your Tacks, </p> 
               <p>- Discover all the Tacks,</p>
               <p>- Follow our users.</p>
               <p>We can't wait to discovering your Tacks!!</p>
               `,
              })
              .then((result) => {
                console.log("result within transporter");
              })
              .catch((err) => {
                console.log(err);
              });
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
          console.log("savedUser within /login", savedUser);
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

router.post("/forgotpassword", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(422).json({
          error: "We couldn't find an account with that email.",
        });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 30 * 60 * 1000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: EMAIL_FROM,
          subject: `Tack - Reset your password link`,
          html: `
          <h5>Hi ${user.firstName},</h5>
          <p>Please, use the following link to reset your password:</p>
          <a href="http://localhost:3000/resetpassword/${token}" style="color: #546e7a">Link</a>
          <br/>
          <h5>Tack team</h5>
          `,
        });
        res.status(200).json({
          message: `An email has been sent to '${user.email}'. Use the link to reset
          your password.`,
        });
      });
    });
  });
});

router.post("/resetpassword", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.resetToken;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      return res.status(422).json({
        error: "Your token has expired. Try again.",
      });
    }
    bcrypt
      .hash(newPassword, 12)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((updatedUser) => {
          return res
            .status(200)
            .json({ message: "Password updated successfully." });
        });
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
