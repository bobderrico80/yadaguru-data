'use strict';

var moment = require('moment');

module.exports = function(models) {
  return require('./baseDbService')(models.School);
};
