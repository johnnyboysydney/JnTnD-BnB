const express = require("express");
const router = express.Router();
const db = require("../models");

//get all the res
router.get("/tables", (req, res) => {
  db.Table.findAll({}).then(data => {
    const hbsObject = { tables: data };
    res.render("tables", hbsObject);
  });
});

//adding a res to the list
router.post("/tables", (req, res) => {
  db.Table.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    numParty: req.body.num_party,
    resTime: req.body.res_time
  }).then(data => {
    db.Table.update(
      {
        GuestId: data.dataValues.id,
        available: false
      },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(data => {
      res.redirect("/tables");
    });
  });
});

//delete a res
router.delete("/tables/:id", (req, res) => {
  return db.Table.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect("/tables");
  });
});

module.exports = router;
