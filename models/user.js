'use strict';
var cipher = require('../services/cipherService');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      set: function(phoneNumber) {
        var encryptedPhoneNumber = cipher.encrypt(phoneNumber);
        this.setDataValue('phoneNumber', encryptedPhoneNumber);
      },
      get: function() {
        var encryptedPhoneNumber = this.getDataValue('phoneNumber');
        var phoneNumber = cipher.decrypt(encryptedPhoneNumber);
        return phoneNumber;
      }
    },
    confirmCode: DataTypes.STRING,
    confirmCodeTimestamp: DataTypes.DATE,
    sponsorCode: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.School, {
          onDelete: 'cascade',
          foreignKey: {
            name: 'userId',
            allowNull: false
          }
        });
      }
    }
  });
  return User;
};
