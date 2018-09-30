const methodOverride = require("method-override");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const mlab = require("./config/keys").mlab;
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const app = express();

//create a connection to mlabs
mongoose
  .connect(
    mlab, {
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

app.use(flash());

//set the path to the public directory
app.use(express.static(path.join(__dirname, "public")));
//sessions middlewares
app.use(
  session({
    secret: "nigga",
    resave: true,
    saveUninitialized: true
  })
);

//Global variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success_msg");
  res.locals.error = req.flash("error_msg");
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

const port = 4000;

app.listen(port, () => console.log(`Server running at port ${port}`));