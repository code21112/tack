const { response } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const { authMiddleware } = require("./../middlewares/authMiddleware");

// router.get("/user/:id", (req, res) => {
//   User.findOne({ _id: req.params.id })
//     .then((user) => {
//       user.password = undefined;
//       Post.find({ postedBy: user._id })
//         // .populate("", "_id name")
//         .populate("postedBy", "_id name")
//         .then((posts) => {
//           return res.status(200).json({
//             user,
//             posts,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       return (
//         res.status(404),
//         json({
//           error: err,
//         })
//       );
//     });
// });

router.get("/user/:id", authMiddleware, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name firstName")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({
              error: err,
            });
          }
          return res.status(200).json({
            user,
            posts,
          });
        });
    })
    .catch((err) => {
      console.log("err", err);
      return res.status(404).json({
        error: "User not found",
      });
    });
});

// router.put("/follow", authMiddleware, (req, res) => {
//   User.findByIdAndUpdate(
//     req.body.followedId,
//     {
//       $push: { followers: req.user._id },
//     },
//     { new: true },
//     (err, result) => {
//       if (err) {
//         return res.status(422).json({ error: err });
//       }
//       User.findByIdAndUpdate(
//         req.user._id,
//         { $push: { following: req.body.followedId } },
//         { new: true }
//       )
//         .select("-password")
//         .then((result) => {
//           return res.status(200).json(result);
//         })
//         .catch((err) => {
//           return res.status(422).json({
//             error: err,
//           });
//         });
//     }
//   );
// });

router.put("/follow", authMiddleware, (req, res) => {
  User.findById(req.body.followedId).then((user) => {
    if (user.followers.includes(req.user._id)) {
      return res.status(422).json({
        message: " You are currently following that user!",
      });
    } else {
      User.findByIdAndUpdate(
        req.body.followedId,
        {
          $push: { followers: req.user._id },
        },
        { new: true },
        (err, result) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followedId } },
            { new: true }
          )
            .select("-password")
            .then((result) => {
              return res.status(200).json(result);
            })
            .catch((err) => {
              return res.status(422).json({
                error: err,
              });
            });
        }
      );
    }
  });
});

router.put("/unfollow", authMiddleware, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowedId,
    { $pull: { followers: req.user._id } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowedId } },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          return res.status(422).json({
            error: err,
          });
        });
    }
  );
});

// router.put("/updatepic", authMiddleware, (req, res) => {
//   User.findByIdAndUpdate(
//     req.user._id,
//     { pic: req.body.pic },
//     { new: true }
//   ).exec((err, result) => {
//     if (err) {
//       return res.status(422).json({
//         message: "An error occured...Please try again later",
//         error: err,
//       });
//     }
//     res.status(200).json(result);
//   });
// });

router.put("/updatepic", authMiddleware, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { pic: req.body.pic },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({
          message: "An error occured...Please try again later",
          error: err,
        });
      }
      res.status(200).json(result);
    }
  );
});

module.exports = router;
