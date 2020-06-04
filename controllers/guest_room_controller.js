module.exports = function(app, passport, db) {
  
  app.post(
    "/room/book",
    passport.authenticate("guest-book", {
      successRedirect: "/guest",
      failureRedirect: "/"
    })
  );

  app.get("/room/book", (req, res) => {
    console.log('test');
    db.Room.findAll({}).then(result => {
      res.render("guest-room-book", { rooms: result, isGuest: true });
    });
  });

  
  app.put("/guest/checkout", isLoggedIn, (req, res) => {
    req.session.destroy(err => {
      if (err) {
        throw err;
      }
      {
        db.Room.update(
          {
            available: true,
            checkin: false
          },
          {
            where: {
              GuestId: req.user.id
            }
          }
        ).then(result => {
          db.Guest.destroy({
            where: {
              id: req.user.id
            }
          }).then(() => {
            res.redirect("/");
          });
        });
      }
    });
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/guest/login');
  }

  
} // End of Module