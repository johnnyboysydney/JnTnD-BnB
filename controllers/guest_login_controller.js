module.exports = function(app, passport, db) {
   
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
          return res.redirect('/guest');
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
        isGuest: true,
        isGuestLoggedIn: true
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
  
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/guest/login');
  }

} // END OF MODULE