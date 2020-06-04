// Dependencies
const express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");

// Sets up the Express App
const app = express();
var PORT = process.env.PORT || 80;

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
//app.use(require("./controllers/table_controller"));
app.use(require("./controllers/api-yelp"));
app.use(require("./controllers/api-weather"));

// include auth controllers
require("./controllers/guest_room_controller")(app, passport, db);
require("./controllers/guest_table_controller")(app, passport, db);
require("./controllers/guest_login_controller")(app, passport, db);
require("./controllers/admin_controller")(app, passport, db);
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
