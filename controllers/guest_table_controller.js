module.exports = function(app, passport, db) {

//get all the reservations
app.get("/tables", (req, res) => {
  db.Table.findAll({}).then(data => {
    res.render("tables",  { 
      tables: data, 
      isGuest: true
    });
  });
});

//adding a reservations to the list
app.post("/tables", (req, res) => {

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
  });

});

//delete a res
app.delete("/tables/:id", (req, res) => {
  return db.Table.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect("/tables");
  });
});


/*
 * New Table Reservation controllers
 */

// View table reservation page
app.get("/table", (req, res) => {

  res.render("book",  { 
    isGuest: true
  });

});

// Push table reservation 
app.post("/table/book", (req, res) => {

  const data = {};

  db.Guest.findOrCreate({
    where: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
    }
  })
  .then((result, created) => {

    data.guest = result[0];

    // First the logic
    // Check stock and res, to see if there is a cross over.

    //db.Stock.findAll() 

    //db.Res.findAll()

    //const userId = result; 
    db.Res.create({
      res_time: req.body.res_time,
      party_size: req.body.party_size,
      GuestId: parseInt(result[0].dataValues.id)
    })
    .then(result => {

      data.res = result;
      res.json({ data });

    });

  })

});

app.post("/table/cancel", (req, res) => {

  db.Res.update({
    status: -1,
  },
  {
    where: {
      id: req.body.id
    }
  }).then((affectedCount) => {

    if (affectedCount) {
      db.Res.findByPk(req.body.id, { include: ['guest'] })
      .then(data => {

        res.json({ data });
    
      })
    }

    
  });

});






} // End of Module