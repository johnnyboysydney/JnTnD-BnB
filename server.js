// Dependencies
const express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");

// Sets up the Express App
const app = express();
var PORT = process.env.PORT || 8080;

// Models to sync
const db = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "Astronaut Mars",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve files in 'public' directory
app.use(express.static("public"));

// Load routes
app.use(require("./controllers/index_controller"));
app.use(require("./controllers/guest_controller"));
app.use(require("./controllers/table_controller"));
app.use(require("./controllers/api-yelp"));
app.use(require("./controllers/api-weather"));

require("./controllers/guest_auth_controller")(app, passport);
require("./controllers/admin_auth_controller")(app, passport);
require("./config/passport/passport.js")(passport);

app.use("/", (req, res) => {
  res.render("index");
});

// Sync models then start the server to begin listening
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("----------------------");
    console.log("App listening on PORT " + PORT);
  });
});
