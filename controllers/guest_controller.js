// Dependencies
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/room/book", (req, res) => {
  db.Room.findAll({}).then(result => {
    res.render("bookroom", { rooms: result });
  });
});

module.exports = router;
