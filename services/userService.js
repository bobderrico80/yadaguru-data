'use strict';

module.exports = function(models) {
  var userService = require('./baseDbService')(models.User);

  userService.getUserByPhoneNumber = function(phoneNumber) {
    return User.findOne({where: {phoneNumber: phoneNumber}}).then(function(user) {
      return user;
    })
  };

  return userService;
};
