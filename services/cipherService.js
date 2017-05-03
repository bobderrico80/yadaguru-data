'use strict';

var salt = process.env.SECRET_SALT || 'development_secret_salt';
var crypto = require('crypto');

module.exports = {
  encrypt: function(value) {
    var cipher = crypto.createCipher('aes192', salt);
    var encryptedValue = cipher.update(value, 'utf8', 'hex');
    encryptedValue += cipher.final('hex');
    return encryptedValue;
  },
  decrypt: function(encryptedValue) {
    var decipher = crypto.createDecipher('aes192', salt);
    var value = decipher.update(encryptedValue, 'hex', 'utf8');
    value += decipher.final('utf8');
    return value;
  }
}