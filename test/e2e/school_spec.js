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
var schoolService;

describe('The schoolService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    schoolService = dbServices.schoolService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all schools for a user from the database', function() {
    return schoolService.findByUser(1).then(function(schools) {
      schools.length.should.equal(2);
      schools[0].name.should.equal('Temple');
      schools[1].name.should.equal('Drexel');
    });
  });

  it('should get one schools by id for a user from the database', function() {
    return schoolService.findByIdForUser(1, 1).then(function(schools) {
      schools.length.should.equal(1);
      schools[0].id.should.equal(1);
    });
  });

  it('should create a new schools and return schools schools', function() {
    return schoolService.create({
      userId: '1',
      name: 'Foo',
      isActive: true,
      dueDate: '2000-01-01'
    }).then(function(schools) {
      schools[0].id.should.equal(3);
      schools[0].name.should.equal('Foo');
    });
  });

  it('should update an existing school for a user and return the updated schools', function() {
    return schoolService.updateForUser(1, {
      name: 'Foo'
    }, 1).then(function(schools) {
      schools[0].id.should.equal(1);
      schools[0].name.should.equal('Foo');
    })
  });

  it('should delete an existing school for a user, returning true', function() {
    return schoolService.create({
      userId: '1',
      name: 'Foo',
      isActive: true,
      dueDate: '2000-01-01'
    }).then(function() {
      return schoolService.destroyForUser(3, 1).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
