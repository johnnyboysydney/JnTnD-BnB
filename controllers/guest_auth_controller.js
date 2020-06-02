const db = require("../models");

module.exports = function(app, passport) {
  app.post(
    "/room/book",
    passport.authenticate("guest-book", {
      successRedirect: "/guest",
      failureRedirect: "/"
    })
  );
  
  app.get("/guest/login", (req, res) => {
    res.render("guestbook", { isGuest: true });
  });

  app.post("/guest/login", function(req, res, next) {
 
      passport.authenticate("guestlogin", function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          // *** Display message without using flash option
          // re-render the login form with a message
          return res.render('guestbook', { isGuest: true, message: info.message })
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/users/' + user.username);
        });
      })(req, res, next);

    });


  app.get("/guest", isLoggedIn, (req, res) => {
    db.Guest.findAll({
      where: {
        id: req.user.id
      },
      include: [db.Room]
    }).then(result => {
      res.render("guest", {
        guest: result,
        isGuest: true
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
};
