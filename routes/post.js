const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const {
  checklogin
} = require('../auth/auth');


router.get("/", checklogin, (req, res) => {
  Post.find({
      id: req.user.id
    })
    .then(allposts => {
      res.render("posts/index", {
        allposts
      });
    })
    .catch(err => console.log(err));
});

router.post("/insert_post", checklogin, (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({
      text: "Please enter title"
    });
  }

  if (!req.body.details) {
    errors.push({
      text: "Please enter Post body"
    });
  }

  if (errors.length > 0) {
    res.render("posts/add", {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    //insert into mongodb
    const new_post = new Post({
      title: req.body.title,
      details: req.body.details,
      id: req.user.id
    });

    new_post
      .save()
      .then(post => {
        req.flash('success_msg', "Post added succesfully")
        res.redirect("/post");
      })
      .catch(err => console.log(err));
  }
});

router.get("/add", checklogin, (req, res) => {
  res.render("posts/add");
});

router.get("/edit/:id", checklogin, (req, res) => {
  Post.findById({
      _id: req.params.id
    })
    .then(single_post => {
      if (single_post.id != req.user.id) {
        req.flash('error_msg', "not authorized")
        res.redirect('/post')
      } else {
        res.render("posts/edit", {
          single_post
        });
      }
    })

    .catch(err => console.log(err));
});

router.put("/:id", checklogin, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(post => {
      post.save()
      req.flash('success_msg', "Post Edited succesfully")
        .then(res.redirect("/post"))
    })

});

router.delete("/:id", checklogin, (req, res) => {
  Post.deleteOne({
      id: req.params.id
    })
    .then(() => {
      req.flash('error_msg', "Post  Deleted")
      res.redirect("/post")
    })
})

module.exports = router;