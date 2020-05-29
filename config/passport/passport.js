const LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
const db = require("../../models");

module.exports = function(passport) {

    let Guest = db.Guest;
    let Admin = db.Manager;
  
    passport.serializeUser(function(user, done) {
      return done(null, { id: user.id, isAdmin: user.isAdmin });
    });
  
    passport.deserializeUser(function(id, done) {
      if (!id.isAdmin) {
        Guest.findById(id.id).then(function(user) {
          if (user) {
            done(null, user.get());
          }
        }).catch(function (err) {
          console.log(err);
        });
      }
      else if (id.isAdmin) {
        Admin.findById(id.id).then(function(user) {
          if (user) {
            done(null, user.get());
          }
        }).catch(function (err) {
          console.log(err);
        });
      }
    });
    