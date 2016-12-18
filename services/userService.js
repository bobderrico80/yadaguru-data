'use strict';

module.exports = function(models) {
  var User = models.User;
  var userService = require('./baseDbService')(User);

  userService.getUserByPhoneNumber = function(phoneNumber) {
    return User.findOne({where: {phoneNumber: phoneNumber}}).then(function(user) {
      return user;
    })
  };

  return userService;
};
