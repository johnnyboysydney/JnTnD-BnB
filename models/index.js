'use strict';

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const baseName  = path.basename(module.filename);
let env         = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/config.json')[env];
let db          = []; 






db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;