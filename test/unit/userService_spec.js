'use strict';

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('The Users Service', function() {
  var mocks = require('../mocks')('User');
  var userService;

  var users = [{
    id: 1,
    phoneNumber: '1234567890',
    confirmCode: '123456',
    confirmCodeTimestamp: '',
    sponsorCode: '123456'
  }, {
    id: 2,
    phoneNumber: '9876543210',
    confirmCodeTimestamp: '',
    sponsorCode: '654321'
  }];
  
  beforeEach(function() {
    mocks.stubMethods();

    userService = require('../../services/userService')(mocks.modelMock);
  });

  afterEach(function() {
    mocks.restoreStubs();
  });

  describe('The findAll function', function() {
    it('should resolve with an array of objects representing users', function() {
      mocks.stubs.User.findAll.returns(Promise.resolve(users.map(
        function(user) {
          return {dataValues: user};
        }
      )));

      return userService.findAll().should.eventually.deep.equal(users);
    });

    it('should resolve with an empty array there are no users', function() {
      mocks.stubs.User.findAll.returns(Promise.resolve([]));

      return userService.findAll().should.eventually.deep.equal([]);
    });
  });

  describe('The findById function', function() {
    it('should resolve with an array with the matching user object', function() {
      mocks.stubs.User.findById.withArgs(1)
        .returns(Promise.resolve({dataValues: users[0]}));

      return userService.findById(1).should.eventually.deep.equal([users[0]]);
    });

    it('should resolve with an empty array if no users were found', function() {
      mocks.stubs.User.findById.withArgs(3)
        .returns(Promise.resolve(null));

      return userService.findById(3).should.eventually.deep.equal([]);
    });
  });

  describe('The getUserByPhoneNumber function', function() {
    it('should resolve with  the matching user object', function() {
      var userObj = {dataValues: users[0]};
      mocks.stubs.User.findOne.withArgs({where: {phoneNumber: '1234567890'}})
        .returns(Promise.resolve(userObj));

      return userService.getUserByPhoneNumber('1234567890').should.eventually.deep.equal(userObj);
    });

    it('should resolve with null if no matching users were found', function() {
      mocks.stubs.User.findOne.withArgs({where: {phoneNumber: '5555555555'}})
        .returns(Promise.resolve(null));

      return userService.getUserByPhoneNumber('5555555555').should.eventually.deep.equal(null);
    });
  });

  describe('The create function', function() {
    var newUser = {
      phoneNumber: '1234567890'
    };

    it('should resolve with an array containing the new user object', function() {
      mocks.stubs.User.create.withArgs(newUser)
        .returns(Promise.resolve({dataValues: newUser}));

      return userService.create(newUser).should.eventually.deep.equal([newUser]);
    });
  });

  describe('The update function', function() {
    var row, update, idToUpdate;

    var updatedUser = {
      phoneNumber: '1234567890'
    };

    idToUpdate = 1;

    before(function() {
      row = {update: function(){}};
      update = sinon.stub(row, 'update');
    });

    after(function() {
      update.restore();
    });

    it('should resolve with an array containing the updated user object', function() {
      mocks.stubs.User.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(row));
      update.withArgs(updatedUser)
        .returns(Promise.resolve({dataValues: updatedUser}));

      return userService.update(idToUpdate, updatedUser).should.eventually.deep.equal([updatedUser]);
    });

    it('should resolve with false if the id does not exist', function() {
      mocks.stubs.User.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(null));

      return userService.update(idToUpdate, updatedUser).should.eventually.be.false;
    });
  });

  describe('The destroy function', function() {
    var row, destroy;

    var idToDestroy = 1;

    before(function() {
      row = {destroy: function(){}};
      destroy = sinon.stub(row, 'destroy');
    });

    after(function() {
      destroy.restore();
    });

    it('should resolve with true when the row is destroyed', function() {
      mocks.stubs.User.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(row));
      destroy.withArgs()
        .returns(Promise.resolve(undefined));

      return userService.destroy(idToDestroy).should.eventually.be.true;
    });

    it('should resolve with false id does not exist', function() {
      mocks.stubs.User.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(null));

      return userService.destroy(idToDestroy).should.eventually.be.false;
    });
  });
});
