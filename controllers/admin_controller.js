module.exports = function(app, passport, db) {
  // HOME PAGE
  app.get("/admin", function(req, res) {
    res.redirect('/admin/login'); 
  });

  // LOGIN 

  app.get('/admin/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('loginadmin', { isAdmin: true}); 
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);
  /*
  app.post('/admin/login', passport.authenticate('admin-login', {
    successRedirect : '/admin/menu', 
    failureRedirect : '/admin/login' 
  })
  );*/

  app.post("/admin/login", function(req, res, next) {
 
    passport.authenticate("admin-login", function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        // *** Display message without using flash option
        // re-render the login form with a message
        //return res.render('guestbook', { isGuest: true, message: info.message })
        return res.render('loginadmin', { isAdmin: true, message: info.message });
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/admin/menu');
      });
    })(req, res, next);

  });


  // SIGNUP 
  app.get('/admin/signup', function(req, res) {
    res.render('adminsignup', { isAdmin: true});
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);
  app.post('/admin/signup', passport.authenticate('admin-signup', {
    successRedirect : '/admin/menu', // redirect to the secure profile section
    failureRedirect : '/admin/signup' // redirect back to the signup page if there is an error
  }));

  app.get('/admin/menu', isLoggedIn, function(req, res) {
    res.render('manager', { isAdmin: true, tpl: 'view-admin-home'});
  });

  app.get('/admin/guests', isLoggedIn, function(req, res) {

    db.Guest.findAll().then(function(result) {
      res.render('guests', { guests: result, isAdmin: true});
    });
    
  });

  app.post('/admin/guests', isLoggedIn, function(req, res) {

    db.Guest.findAll({
      where: {
        first_name: {
          [db.Op.like]: req.body.search + '%'
        } 
      }
    }).then(function(result) {
      res.render('guests', { guests: result, isAdmin: true});
    });
    
  });

  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/admin/rooms', isLoggedIn, function(req, res) {
    db.Room.findAll({include: [db.Guest]}).then(function(result) {
      
      res.render("admin-rooms", {
        rooms: result,
        isAdmin: true
      });
    });
  });

  app.post('/admin/rooms', isLoggedIn, function(req, res) {
    db.Guest.findAll({
      where: {
        last_name: req.body.name
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  app.get('/admin/rooms/id/:id', isLoggedIn, function(req, res) {
    db.Room.findAll({
      where: {
        id: req.params.id
      },
      include: [db.Guest]
    }).then(function(result) {
      
      res.render("room", {
        rooms: result,
        isAdmin: true
      });
    });
  });

  app.get('/admin/book/id/:id', isLoggedIn, function(req, res) {
    db.Room.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      
      res.render("book-id", {rooms: result, isAdmin: true });
    });
  });

  app.post('/admin/book/id/:id', isLoggedIn, function(req, res) {
    db.Guest.create({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email,
      room_number: req.body.room,
      checkin: req.body.checkin,
      checkout: req.body.checkout
    }).then(function(result1) {
      db.Room.update({
        GuestId: result1.dataValues.id,
        available: false
      }, {
        where: {
          id: req.body.room
        }
      }).then(function(result) {
        res.redirect("/admin/rooms/id/" + req.body.room);
      });
    });
  });

  app.put("/admin/checkin/id/:id", isLoggedIn, function(req, res) {
    db.Room.update({
      checkin: true
    }, {
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.redirect("/admin/rooms/id/" + req.params.id);
    });
  });

  app.put("/admin/checkout/id/:id", isLoggedIn, function(req, res) {
    db.Guest.findOne({
      where: {
        room_number: req.params.id
      }
    }).then(function(result) {
      db.Room.update({
        available: true,
        checkin: false,
      }, {
        where: {
          id: req.params.id
        }
      }).then(function(result2) {
        db.Guest.destroy({
          where: {
            id: result.dataValues.id
          }
        }).then(function(result3) {
          res.redirect("/admin/rooms/id/" + result.dataValues.room_number);
        });
      });
    });
  });

  app.put("/admin/delete/id/:id", isLoggedIn, function(req, res) {
    db.Guest.findOne({
      where: {
        room_number: req.params.id
      }
    }).then(function(result) {
      db.Room.update({
        available: true,
        checkin: true,
        GuestId: null
      }, {
        where: {
          id: req.params.id
        }
      }).then(function(result2) {
        db.Guest.destroy({
          where: {
            id: result.dataValues.id
          }
        }).then(function(result3) {
          res.redirect("/admin/rooms/id/" + result.dataValues.room_number);
        });
      });
    });
  });

  //table view for manager
  app.get('/admin/tables', isLoggedIn, function(req, res) {
    db.Table.findAll({}).then(function(result) {
      res.render("tables-admin", {
        tables: result,
        isAdmin: true
      });
    });
  });

  app.post('/admin/tables-admin', isLoggedIn, function(req, res) {
    db.Table.findAll({
      where: {
        name: {
          [Op.like]: req.body.name + '%'
        }
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  app.get('/admin/tables/id/:id', isLoggedIn, function(req, res) {
    db.Table.findAll({
      where: {
        id: req.params.id
      },
    }).then(function(result) {
      res.render("table", {
        tables: result,
        isAdmin: true
      });
    });
  });

  // LOGOUT ==============================
  app.get('/admin/logout', isLoggedIn, function(req, res) {
    req.session.destroy(function(err) {
      res.redirect('/admin');
    });
  });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/admin/login');
}