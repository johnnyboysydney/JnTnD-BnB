// Dependencies
const express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Models to sync
const db = require("./models");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(
    session({
      secret: "keyboard cat",
      resave: true,
      saveUninitialized: true
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());  

app.use("/", (req, res) => {
    res.render("index");
  });

  app.engine("handlebars", exphbs({ defaultLayout: "main" }));
  app.set("view engine", "handlebars");
  
  // Serve files in 'public' directory
  app.use(express.static("public"));

// Sync models then start the server to begin listening
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log("----------------------");
      console.log("App listening on PORT " + PORT);
    });
  });