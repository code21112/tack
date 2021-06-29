const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const { authMiddleware } = require("./../middlewares/authMiddleware");

router.post("/post/create", authMiddleware, (req, res) => {
  const { title, body, url } = req.body;
  // console.log(title, body, url);
  if (!title || !body || !url) {
    return res.status(422).json({
      error: "Please fill all the fields",
    });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: url,
    postedBy: req.user,
  });
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: "Post successfully created.",
        post,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/posts", authMiddleware, (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      posts = posts.reverse();
      return res.status(200).json({
        posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/my-posts", authMiddleware, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "id name")
    .populate("postedBy", "followers following")
    .then((posts) => {
      if (posts.length === 0) {
        return res.status(200).json({
          message: "Let's create your first post!",
        });
      } else {
        return res.status(200).json({
          posts,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.put("/like", authMiddleware, (req, res) => {
//   Post.findByIdAndUpdate(req.body.postId, {
//     $push: { likes: req.user._id }, {
//       new: true,
//     }
//   }).exec((err, result) => {
//     if (err) {
//       return res.status(422).json({
//         error: err,
//       });
//     }
//     res.json(result);
//   });
// });

router.put("/like", authMiddleware, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// router.put("/like", authMiddleware, (req, res) => {
//   Post.findByIdAndUpdate(req.body.postId, {
//     $push: { likes: req.user._id },
//     new: true,
//   }).exec((err, result) => {
//     if (err) {
//       return res.status(422).json({
//         error: err,
//       });
//     }
//     return res.status(200).json(result);
//   });
// });

// router.put("/unlike", authMiddleware, (req, res) => {
//   Post.findByIdAndUpdate(req.body.postId, {
//     $pull: { likes: req.user._id },{
//       new: true
//     }
//   }).exec((err, result) => {
//     if (err) {
//       return res.status(422).json({
//         error: err,
//       });
//     }
//     res.json(result);
//   });
// });

router.put("/unlike", authMiddleware, (req, res) => {
  Post.findByIdAndUpdate(
    { _id: req.body.postId },
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.put("/comment", authMiddleware, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        return res.status(200).json(result);
        // res.json(result);
      }
    });
});

// router.delete("/post/delete/:postId", authMiddleware, (req, res) => {
//   Post.findByIdAndDelete(req.params.postId).exec((err, result) => {
//     if (err) {
//       console.log(err);
//     }
//   });
// });

router.delete("/post/delete/:postId", authMiddleware, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({
          error: err,
        });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.status(200).json({
              message: "Tack deleted successfully",
              result,
            });
            // res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.get("/getfollowedtacks", authMiddleware, (req, res) => {
  const posts = Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      posts = posts.reverse();
      return res.status(200).json({
        posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
