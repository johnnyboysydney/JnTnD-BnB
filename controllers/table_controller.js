const express = require("express");
const router = express.Router();
const db = require("../models");

//get all the reservations
router.get("/tables", (req, res) => {
  db.Table.findAll({}).then(data => {
    const hbsObject = { tables: data };
    res.render("tables", hbsObject);
  });
});

//adding a reservations to the list
router.post("/tables", (req, res) => {

  db.Table.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    num_party: req.body.num_party,
    res_time: req.body.res_time 
  })
  .then((result) => {
    //console.log(res);
    const data = result.dataValues;

    res.json({ data });
    //console.log(res);
    //res.redirect("/tables");
  })

  return;

  
  
  db.Table.create({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    num_party: req.body.num_party,
    res_time: req.body.res_time 
  })
  .then(data => {
    
    //res.redirect("/tables");

    /*
    db.Table.update(
      {
        GuestId: data.id,
        available: false
      },
      { 
        where: {
          id: req.body.id
        }
      }
    )
    .then(() => {

      //console.log('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
      res.redirect("/tables/2");
    });
    */

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
