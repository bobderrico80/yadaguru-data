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
var testDateService;

describe('The testDateService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    testDateService = dbServices.testDateService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all testDates from the database, including joined test info', function() {
    return testDateService.findAll().then(function(testDates) {
      testDates.length.should.equal(2);
      testDates[0].type.should.equal('SAT');
      testDates[0].registrationDate.should.equal('2017-01-01');
      testDates[1].type.should.equal('ACT');
      testDates[1].registrationDate.should.equal('2017-01-15');
    });
  });

  it('should get one testDates by id from the database', function() {
    return testDateService.findById(1).then(function(testDates) {
      testDates.length.should.equal(1);
      testDates[0].id.should.equal(1);
    });
  });

  it('should create a new testDates and return testDates testDates', function() {
    return testDateService.create({
      testId: 1,
      registrationDate: '2000-01-01',
      adminDate: '2000-01-01'
    }).then(function(testDates) {
      testDates[0].id.should.equal(3);
      testDates[0].testId.should.equal(1);
    });
  });

  it('should update an existing testDates and return the updated testDates', function() {
    return testDateService.update(1, {
      testId: '2'
    }).then(function(testDates) {
      testDates[0].id.should.equal(1);
      testDates[0].testId.should.equal('2');
    })
  });

  it('should delete an existing testDates, returning true', function() {
    return testDateService.create({
      testId: 1,
      registrationDate: '2000-01-01',
      adminDate: '2000-01-01'
    }).then(function() {
      return testDateService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
