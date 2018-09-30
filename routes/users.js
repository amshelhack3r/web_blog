const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
//bring in the model to hash the password
const User = require("../models/User");

router.get('/login', (req, res) => {

    res.render("users/login");
})

router.get('/register', (req, res) => {
    //get the data fro the form 
    res.render("users/register");
})

router.post('/add', (req, res) => {
    //do some serve side validation


    const new_user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    //hash the password
    bcrypt.hash(new_user.password, 8, (err, hash) => {
        if (err) {
            console.log(err);
        }
        new_user.password = hash;
        new_user.save()
            .then(() => res.redirect("/users/login"))
            .catch(err => console.log(err))
    })
})

router.post("/login/check", (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {


            bcrypt.compare(req.body.password, user.password, (err, res) => {
                if (err) {
                    console.log(err);

                }
                console.log("password match");
            })
        })

        .catch(err => console.log(err));

})

module.exports = router;