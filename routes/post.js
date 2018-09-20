const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", (req, res) => {
  Post.find({})
    .then(allposts => {
      res.render("posts", {
        allposts
      });
    })
    .catch(err => console.log(err));
});

router.post("/insert_post", (req, res) => {
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
    res.render("addpost", {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    //insert into mongodb
    const new_post = new Post(req.body);

    new_post
      .save()
      .then(post => {
        req.flash('success_msg', "Post added succesfully")
        res.redirect("/post");
      })
      .catch(err => console.log(err));
  }
});

router.get("/add", (req, res) => {
  res.render("addpost");
});

router.get("/edit/:id", (req, res) => {
  Post.findById({
      _id: req.params.id
    })
    .then(single_post => {
      res.render("editpost", {
        single_post
      });
    })

    .catch(err => console.log(err));
});

router.put("/:id", (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(post => {
      post.save()
      req.flash('success_msg', "Post Edited succesfully")
        .then(res.redirect("/post"))
    })

});

router.delete("/:id", (req, res) => {
  Post.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      req.flash('error_msg', "Post  Deleted")
      res.redirect("/post")
    })
})

module.exports = router;