'use strict';

module.exports = function(config) {
  var models = require('./models')(config);
  var dbServices = {};
  dbServices.models = models;

  return [
    'categoryService',
    'baseReminderService',
    'timeframeService',
    'testService',
    'testDateService',
    'contentItemService',
    'schoolService',
    'reminderService',
    'userService',
    'adminUserService'
  ].reduce(function(services, service) {
    services[service] = require('./services/' + service)(models);
    return services;
  }, dbServices);
};