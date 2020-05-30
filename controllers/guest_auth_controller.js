const db = require("../models");

module.exports = function(app, passport) {
  app.post(
    "/room/book",
    passport.authenticate("local-signup", {
      successRedirect: "/guest",
      failureRedirect: "/"
    })
  );

  app.get("/guest", isLoggedIn, (req, res) => {
    db.Guest.findAll({
      where: {
        id: req.user.id
      },
      include: [db.Room]
    }).then(result => {
      res.render("guest", {
        guest: result
      });
    });
  });

  app.get("/guest/logout", isLoggedIn, (req, res) => {
    req.session.destroy(err => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    });
  });

  app.post(
    "/guest/login",
    passport.authenticate("local-signin", {
      successRedirect: "/guest",
      failureRedirect: "/guest/login"
    })
  );

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
              id: result.user.id
            }
          }).then(() => {
            res.redirect("/");
          });
        });
      }
    });
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/guest/login");
  }
};
