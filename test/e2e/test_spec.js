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
var testService;

describe('The testService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    testService = dbServices.testService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all tests from the database', function() {
    return testService.findAll().then(function(tests) {
      tests.length.should.equal(2);
      tests[0].type.should.equal('SAT');
      tests[1].type.should.equal('ACT');
    });
  });

  it('should get one tests by id from the database', function() {
    return testService.findById(1).then(function(tests) {
      tests.length.should.equal(1);
      tests[0].id.should.equal(1);
    });
  });

  it('should create a new tests and return tests tests', function() {
    return testService.create({
      type: 'Foo',
      registrationMessage: 'Foo',
      registrationDetail: 'Foo',
      adminMessage: 'Foo',
      adminDetail: 'Foo'
    }).then(function(tests) {
      tests[0].id.should.equal(3);
      tests[0].type.should.equal('Foo');
    });
  });

  it('should update an existing tests and return the updated tests', function() {
    return testService.update(1, {
      type: 'Foo'
    }).then(function(tests) {
      tests[0].id.should.equal(1);
      tests[0].type.should.equal('Foo');
    })
  });

  it('should delete an existing tests, returning true', function() {
    return testService.create({
      type: 'Foo',
      registrationMessage: 'Foo',
      registrationDetail: 'Foo',
      adminMessage: 'Foo',
      adminDetail: 'Foo'
    }).then(function() {
      return testService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
