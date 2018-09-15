const express = require('express');
const mongoose = require('moongoose');
const exphbs = require('express-handlebars');
const mlab = require("./config/keys").mlab;
const app = express();

mongoose.connect(mlab)
    .then(() => console.log("connected to mlabs"))
    .catch(err => console.log(err));

app.engine('handlebars', exphbs({
    defaultLayout: 'template'
}));
app.set('view engine', 'handlebars');


//require the routes we have created
const root = require("./routes/index");
const about = require("./routes/about");
const post = require("./routes/post");

app.use('/', root);
app.use('/about', about);
app.use('/post', post);


const port = 4000;

app.listen(port, () => console.log(`Server running at port ${port}`))