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
var bcrypt = require('bcryptjs');
var dbServices;
var adminUserService;

describe('The adminUserService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    adminUserService = dbServices.adminUserService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should create a new admin user', function() {
    return adminUserService.create('admin', 'password').then(function(adminUser) {
      adminUser.id.should.equal(1);
      adminUser.userName.should.equal('admin');
      bcrypt.compareSync('password', adminUser.password).should.equal(true);
    });
  });

  it('should verify an existing users', function() {
    return adminUserService.create('admin', 'password').then(function() {
      return adminUserService.verifyUser('admin', 'password').then(function(response) {
        response.id.should.equal(1);
      })
    });
  });


});
