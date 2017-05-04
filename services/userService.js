'use strict';
var cipher = require('./cipherService');

module.exports = function(models) {
  var User = models.User;
  var userService = require('./baseDbService')(User);

  userService.getUserByPhoneNumber = function(phoneNumber) {
    var encryptedPhoneNumber = cipher.encrypt(phoneNumber);
    return User.findOne({where: {phoneNumber: encryptedPhoneNumber}}).then(function(user) {
      return user;
    })
  };

  return userService;
};
