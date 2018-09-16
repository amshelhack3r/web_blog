const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostModel = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    post_date: {
        type: Date,
        Default: Date.now
    }
})



module.exports = mongoose.model("post_model", PostModel);