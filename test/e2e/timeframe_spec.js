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
var timeframeService;

describe('The timeframeService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    timeframeService = dbServices.timeframeService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all timeframes from the database', function() {
    return timeframeService.findAll().then(function(timeframes) {
      timeframes.length.should.equal(3);
      timeframes[0].name.should.equal('Today');
      timeframes[1].name.should.equal('30 Days Before');
    });
  });

  it('should get one timeframe by id from the database', function() {
    return timeframeService.findById(1).then(function(timeframes) {
      timeframes.length.should.equal(1);
      timeframes[0].id.should.equal(1);
    });
  });

  it('should create a new timeframe and return timeframe timeframe', function() {
    return timeframeService.create({
      name: 'Foo',
      type: 'relative',
      formula: 42
    }).then(function(timeframes) {
      timeframes[0].id.should.equal(4);
      timeframes[0].name.should.equal('Foo');
    });
  });

  it('should update an existing timeframe and return the updated timeframe', function() {
    return timeframeService.update(1, {
      name: 'Foo'
    }).then(function(timeframes) {
      timeframes[0].id.should.equal(1);
      timeframes[0].name.should.equal('Foo');
    })
  });

  it('should delete an existing timeframe, returning true', function() {
    return timeframeService.create({
      name: 'Foo',
      type: 'relative',
      formula: 42
    }).then(function() {
      return timeframeService.destroy(4).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
