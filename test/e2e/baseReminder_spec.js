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
var baseReminderService;

describe('The baseReminderService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    baseReminderService = dbServices.baseReminderService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all baseReminders from the database', function() {
    return baseReminderService.findAll().then(function(baseReminders) {
      baseReminders.length.should.equal(2);
      baseReminders[0].name.should.equal('Write Essay');
      baseReminders[1].name.should.equal('Get Recommendations');
    });
  });

  it('should get all baseReminders with timeframes from the database', function() {
    return baseReminderService.findAllIncludingTimeframes().then(function(baseReminders) {
      baseReminders.length.should.equal(2);
      baseReminders[0].name.should.equal('Write Essay');
      baseReminders[1].name.should.equal('Get Recommendations');
      baseReminders[0].timeframes[0].name.should.equal('Today');
    });
  });

  it('should get one baseReminder by id from the database', function() {
    return baseReminderService.findById(1).then(function(baseReminders) {
      baseReminders.length.should.equal(1);
      baseReminders[0].id.should.equal(1);
    });
  });

  it('should create a new baseReminder and return baseReminder baseReminder', function() {
    return baseReminderService.create({
      name: 'Foo',
      message: 'Foo',
      detail: 'Foo',
      categoryId: 1,
      timeframeIds: [1, 2]
    }).then(function(baseReminders) {
      baseReminders[0].id.should.equal(3);
      baseReminders[0].name.should.equal('Foo');
    });
  });

  it('should update an existing baseReminder and return the updated baseReminder', function() {
    return baseReminderService.update(1, {name: 'Foo'}).then(function(baseReminders) {
      baseReminders[0].id.should.equal(1);
      baseReminders[0].name.should.equal('Foo');
    })
  });

  it('should delete an existing baseReminder, returning true', function() {
    return baseReminderService.create({
      name: 'Foo',
      message: 'Foo',
      detail: 'Foo',
      categoryId: 1,
      timeframeIds: [1, 2]
    }).then(function() {
      return baseReminderService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
