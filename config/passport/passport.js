var LocalStrategy = require("passport-local").Strategy;
var bCrypt = require("bcrypt-nodejs");
var db = require("../../models");

module.exports = function(passport) {
  const Guest = db.Guest;
  const Admin = db.Manager;

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

  // Guest Signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "lastName",
        passReqToCallback: true
      },
      (req, email, lastName, done) => {
        const data = {
          first_name: req.body.firstname,
          last_name: lastName,
          phone: req.body.phone,
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
                GuestId: user.dataValues.id,
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

  // Guest signin
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "room",
        passwordField: "lastName",
        passReqToCallback: true
      },
      (req, room, lastName, done) => {
        
        Guest.findOne({
          where: {
            room_number: room
          }
        })
          .then(result => {
            if (!result) {
              return done(null, false, { message: "User was not found." });
            }
            if (result.last_name.toLowerCase() !== lastName.toLowerCase()) {
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
            last_name: req.body.lastName
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
};
