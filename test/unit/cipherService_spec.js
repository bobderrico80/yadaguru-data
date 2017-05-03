'use strict';

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
chai.should();

describe('The Cipher Service', function() {
  var crypto, cipher;
  var cipherUpdateMock, cipherFinalMock;
  var decipherUpdateMock, decipherFinalMock;

  beforeEach(function() {
    crypto = require('crypto');
    crypto.createCipher = function() {
      return {
        update: function(){return 'ENCRYPT'},
        final: function(){return 'ED'}
      }
    }
    crypto.createDecipher = function() {
      return {
        update: function(){return 'DECRYPT'},
        final: function(){return 'ED'}
      }
    }
    cipher = require('../../services/cipherService');
  });

  describe('Encrypt method', function() {
    it('encrypts and returns the encrypted value', function() {
      cipher.encrypt('DECRYPTED').should.equal('ENCRYPTED');
    });
  });

  describe('Decrypt method', function() {
    it('decrypts and returns the decrypted value', function() {
      cipher.decrypt('ENCRYPTED').should.equal('DECRYPTED');
    });
  });
});