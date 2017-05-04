'use strict';

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();
var mockData = require('../mockData');
var config = require('../testConfig');
var dbServices;
var userService;

describe('The userService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    userService = dbServices.userService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all users from the database', function() {
    return userService.findAll().then(function(users) {
      users.length.should.equal(2);
      users[0].phoneNumber.should.equal('1234567890');
      users[1].phoneNumber.should.equal('9876543210');
    });
  });

  it('should get one user by id from the database', function() {
    return userService.findById(1).then(function(users) {
      users.length.should.equal(1);
      users[0].id.should.equal(1);
    });
  });

  it('should create a new user and return the user', function() {
    return userService.create({phoneNumber: '1112223333'}).then(function(users) {
      users[0].id.should.equal(3);
      users[0].phoneNumber.should.equal('1112223333');
    });
  });

  it('should update an existing user and return the updated user', function() {
    return userService.update(1, {confirmCode: '123456'}).then(function(users) {
      users[0].id.should.equal(1);
      users[0].confirmCode.should.equal('123456');
    })
  });

  it('should delete an existing user, returning true', function() {
    return userService.create({phoneNumber: '1112223333'}).then(function() {
      return userService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

  it('should get a user by phone number', function() {
    return userService.getUserByPhoneNumber('1234567890').then(function(users) {
      users.id.should.equal(1);
    })
  })

});
