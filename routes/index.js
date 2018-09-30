const express = require("express");
const router = express.Router();
const {
    checklogin
} = require('../auth/auth');


router.get('/', checklogin, (req, res) => {
    res.render("index");
});


module.exports = router;