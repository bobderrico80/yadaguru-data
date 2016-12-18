'use strict';

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

var models = require('../../models');
var Test = models.Test;
var testService = require('../../services/testService');

describe('The Tests Service', function() {
  var mocks = require('../mocks')('Test');
  var testService;

  var tests =[{
    id: 1,
    type: 'SAT',
    registrationMessage: 'A message about registering',
    registrationDetail: 'Some details',
    adminMessage: 'A message about the test',
    adminDetail: 'Some details'
  }, {
    id: 2,
    type: 'ACT',
    registrationMessage: 'A message about registering',
    registrationDetail: 'Some details',
    adminMessage: 'A message about the test',
    adminDetail: 'Some details'
  }];
  
  beforeEach(function() {
    mocks.stubMethods();

    testService = require('../../services/testService')(mocks.modelMock);
  });

  afterEach(function() {
    mocks.restoreStubs();
  });

  describe('The findAll function', function() {
    it('should resolve with an array of objects representing tests', function() {
      mocks.stubs.Test.findAll.returns(Promise.resolve(tests.map(
        function(test) {
          return {dataValues: test};
        }
      )));

      return testService.findAll().should.eventually.deep.equal(tests);
    });

    it('should resolve with an empty array there are no tests', function() {
      mocks.stubs.Test.findAll.returns(Promise.resolve([]));

      return testService.findAll().should.eventually.deep.equal([]);
    });
  });

  describe('The findById function', function() {
    it('should resolve with an array with the matching test object', function() {
      mocks.stubs.Test.findById.withArgs(1)
        .returns(Promise.resolve({dataValues: tests[0]}));

      return testService.findById(1).should.eventually.deep.equal([tests[0]]);
    });

    it('should resolve with an empty array if no tests were found', function() {
      mocks.stubs.Test.findById.withArgs(3)
        .returns(Promise.resolve(null));

      return testService.findById(3).should.eventually.deep.equal([]);
    });
  });

  describe('The create function', function() {
    var newTest = {
      type: 'SAT',
      registrationMessage: 'A message about registering',
      registrationDetail: 'Some details',
      adminMessage: 'A message about the test',
      adminDetail: 'Some details'
    };

    it('should resolve with an array containing the new test object', function() {
      mocks.stubs.Test.create.withArgs(newTest)
        .returns(Promise.resolve({dataValues: newTest}));

      return testService.create(newTest).should.eventually.deep.equal([newTest]);
    });
  });

  describe('The update function', function() {
    var row, update, idToUpdate;

    var updatedTest = {
      type: 'SAT',
      registrationMessage: 'A message about registering',
      registrationDetail: 'Some details',
      adminMessage: 'A message about the test',
      adminDetail: 'Some details'
    };

    idToUpdate = 1;

    beforeEach(function() {
      row = {update: function(){}};
      update = sinon.stub(row, 'update');
    });

    afterEach(function() {
      update.restore();
    });

    it('should resolve with an array containing the updated test object', function() {
      mocks.stubs.Test.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(row));
      update.withArgs(updatedTest)
        .returns(Promise.resolve({dataValues: updatedTest}));

      return testService.update(idToUpdate, updatedTest).should.eventually.deep.equal([updatedTest]);
    });

    it('should resolve with false if the id does not exist', function() {
      mocks.stubs.Test.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(null));

      return testService.update(idToUpdate, updatedTest).should.eventually.be.false;
    });
  });

  describe('The destroy function', function() {
    var row, destroy;

    var idToDestroy = 1;

    beforeEach(function() {
      row = {destroy: function(){}};
      destroy = sinon.stub(row, 'destroy');
    });

    afterEach(function() {
      destroy.restore();
    });

    it('should resolve with true when the row is destroyed', function() {
      mocks.stubs.Test.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(row));
      destroy.withArgs()
        .returns(Promise.resolve(undefined));

      return testService.destroy(idToDestroy).should.eventually.be.true;
    });

    it('should resolve with false id does not exist', function() {
      mocks.stubs.Test.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(null));

      return testService.destroy(idToDestroy).should.eventually.be.false;
    });
  });
});
