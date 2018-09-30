const methodOverride = require("method-override");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const cookie = require('cookie-parser');


const app = express();
require('./config/passport')(passport);

//create a connection to mlabs
mongoose
  .connect(
    keys.mlab, {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("connected to mlabs"))
  .catch(err => console.log(err));

//handlebars middlewares
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "template"
  })
);
app.set("view engine", "handlebars");

//method override middleware
app.use(methodOverride("_method"));


//body parser middlewares
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// parse application/json
app.use(bodyParser.json());

//set the path to the public directory
app.use(express.static(path.join(__dirname, "public")));
//sessions middlewares
app.use(
  session({
    secret: keys.secret,
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(cookie());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//require the routes we have created
const root = require("./routes/index");
const about = require("./routes/about");
const post = require("./routes/post");
const user = require("./routes/users");

app.use("/", root);
app.use("/about", about);
app.use("/post", post);
app.use("/users", user);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running at port ${port}`));