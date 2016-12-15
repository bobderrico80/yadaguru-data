'use strict';

module.exports = function(config) {
  var models = require('./models')(config);

  var dbServices = {};

  dbServices.categoryService = require('./services/categoryService')(models);

  return dbServices;
};