const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.authMiddleware = (req, res, next) => {
  //   const { token } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in." });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        error: "You must be logged in.",
      });
    }
    const { _id } = payload;
    User.findById({ _id })
      .then((userData) => {
        req.user = userData;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
