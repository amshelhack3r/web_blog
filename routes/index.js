const express = require("express");
const router = express.Router();
const {
    checklogin
} = require('../auth/auth');


router.get('/', (req, res) => {
    res.render("index");
});


module.exports = router;