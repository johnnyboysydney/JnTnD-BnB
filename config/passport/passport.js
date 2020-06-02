var LocalStrategy = require("passport-local").Strategy;
var bCrypt = require("bcrypt-nodejs");
const db = require("../../models");

module.exports = function(passport) {
  var Guest = db.Guest;
  var Admin = db.Manager;

  passport.serializeUser((user, done) => {
    return done(null, { id: user.id, isAdmin: user.isAdmin });
  });

  passport.deserializeUser((id, done) => {
    if (!id.isAdmin) {
      Guest.findByPk(id.id)
        .then(user => {
          if (user) {
            done(null, user.get());
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (id.isAdmin) {
      Admin.findByPk(id.id)
        .then(user => {
          if (user) {
            done(null, user.get());
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });


  /*



  */

    // FAKE LOGIN
    passport.use(
      "guestlogin",
      new LocalStrategy(
        {
          usernameField: "room",
          passwordField: "lastname",
          passReqToCallback: true
        },
        (req, room, lastname, done) => {       

         Guest.findOne({
            where: {
              last_name: lastname,
              room_number: room
            }
          })
          .then((user, created) => {
          
            if (!user) {
            
              return done(null, false, { message: "Incorrect password." });
            } else if (user) {
              return done(null, user);  
            }

          });
        }
      )
    );


    /*


    */

  // Guest Signup
  passport.use(
    "guest-book",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "lastname",
        passReqToCallback: true
      },
      (req, email, lastname, done) => {

        const data = {
          first_name: req.body.firstname,
          last_name: lastname,
          phone: req.body.contact,
          email: email,
          room_number: req.body.room,
          checkin: req.body.checkin,
          checkout: req.body.checkout
        };

        Guest.create(data).then((user, created) => {
          if (!user) {
            return done(null, false);
          } else if (user) {
            db.Room.update(
              {
                GuestId: user.id,
                available: false
              },
              {
                where: {
                  id: req.body.room
                }
              }
            ).then(() => {
              return done(null, user);
            });
          }
        });
      }
    )
  );

  // Manager signup
  passport.use(
    "admin-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        const generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        Admin.findOne({
          where: {
            email: email
          }
        }).then(result => {
          if (result) {
            return done(null, false, {
              message: "Email already exists."
            });
          }

          const managerPassword = generateHash(password);
          const data = {
            email: email,
            password: managerPassword,
            first_name: req.body.firstname,
            last_name: req.body.lastname
          };
          Admin.create(data).then((newManager, created) => {
            if (!newManager) {
              return done(null, false);
            } else if (newManager) {
              return done(null, newManager);
            }
          });
        });
      }
    )
  );

  // Manager signin
  passport.use(
    "admin-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        const isValidPassword = function(userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        Admin.findOne({
          where: {
            email: email
          }
        })
          .then(result => {
            if (!result) {
              return done(null, false, {
                message: "Email does not exist."
              });
            }
            if (!isValidPassword(result.password, password)) {
              return done(null, false, { message: "Incorrect password." });
            }
            return done(null, result);
          })
          .catch(err => {
            console.log("Error:", err);
            return done(null, false, {
              message: "Something went wrong with your Sign-in"
            });
          });
      }
    )
  );

  // Manager signin
  passport.use(
    "admin-login2",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        const isValidPassword = function(userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        Admin.findOne({
          where: {
            email: email
          }
        })
          .then(result => {
            if (!result) {
              return done(null, false, {
                message: "Email does not exist."
              });
            }
            if (!isValidPassword(result.password, password)) {
              return done(null, false, { message: "Incorrect password." });
            }
            return done(null, result);
          })
          .catch(err => {
            
            return done(null, false, {
              message: "Something went wrong with your Sign-in"
            });
          });
      }
    )
  );

  // Guest signin
  passport.use(
    "guest-login",
    new LocalStrategy(
      {
        usernameField: "room",
        passwordField: "lastname",
        passReqToCallback: true
      },
      (req, room, lastname, done) => {
        
        return done(null, false, { message: "Error with sign in" });

        db.Guest.findOne({
          where: {
            room_number: room
          }
        })
        .then(result => {     

            if (!result) {
              return done(null, false, { message: "User was not found." });
            }
            if (result.last_name.toLowerCase() !== lastname.toLowerCase()) {
              return done(null, false, { message: "Incorrect password." });
            }
            return done(null, result);
          })
          .catch(err => {
            console.log("Error:", err);
            return done(null, false, { message: "Error with sign in" });
          });
      }
    )
  );


};


