// Dependencies
const express = require("express");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

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