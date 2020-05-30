const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/guest/login", (req, res) => {
  res.render("loginguest");
});

router.get("/admin/login", (req, res) => {
  res.render("loginadmin");
});

module.exports = router;
