'use strict';

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire').noCallThru();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

var bcrypt = require('bcryptjs');

describe('The AdminUsers Service', function() {
  var mocks, adminUserService;
  
  beforeEach(function() {

    mocks = require('../mocks')('AdminUser');
    mocks.stubMethods();

    adminUserService = proxyquire('../../services/adminUserService', {
      '../models/': mocks.modelMock,
      'bcryptjs': mocks.bcryptMock
    });
  });

  afterEach(function() {
    mocks.restoreStubs();
  });

  describe('The verifyUser function', function() {
    var adminUser = {
      id: 1,
      userName: 'admin',
      password: 'salted hashed password'
    };

    it('should return user id if the user password matches the salted-hashed password', function() {
      mocks.stubs.AdminUser.findOne.withArgs({where: {userName: 'admin'}})
        .returns(Promise.resolve({dataValues: adminUser}));
      mocks.stubs.bcrypt.compareSync.withArgs('password', 'salted hashed password')
        .returns(adminUser);

      return adminUserService.verifyUser('admin', 'password').should.eventually.deep.equal({id: 1});
    });

    it('should return false if the user does not exist.', function() {
      mocks.stubs.AdminUser.findOne.withArgs({where: {userName: 'bob'}})
        .returns(Promise.resolve(null));

      return adminUserService.verifyUser('bob', 'password').should.eventually.be.false;
    });

    it('should return false if the password does not match', function() {
      mocks.stubs.AdminUser.findOne.withArgs({where: {userName: 'admin'}})
        .returns(Promise.resolve(null));
      mocks.stubs.bcrypt.compareSync.withArgs('wrongpassword', 'salted hashed password')
        .returns(false);

      return adminUserService.verifyUser('admin', 'wrongpassword').should.eventually.be.false;
    });
  });

  describe('The create function', function() {
    var newAdminUser = {
      id: 1,
      userName: 'admin',
      password: 'salted hashed password'
    };

    it('should resolve with a new adminUser object with username and salted & hashed password', function() {
      mocks.stubs.bcrypt.genSaltSync.withArgs(10)
        .returns('salt');
      mocks.stubs.bcrypt.hashSync.withArgs('password', 'salt')
        .returns('salted hashed password');
      mocks.stubs.AdminUser.create.withArgs({userName: 'admin', password: 'salted hashed password'})
        .returns(Promise.resolve({dataValues: newAdminUser}));

      return adminUserService.create('admin', 'password').should.eventually.deep.equal(newAdminUser);
    });
  });
});
