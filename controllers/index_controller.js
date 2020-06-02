const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
  res.render("index", { isGuest: true });
});

router.get("/admin/login", (req, res) => {
  res.render("loginadmin");
});

module.exports = router;
