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
var dbService;

describe('The dbServices', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    dbService = dbServices.categoryService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all resources from the database', function() {
    return dbService.findAll().then(function(resources) {
      resources.length.should.equal(2);
      resources[0].name.should.equal('Essays');
      resources[1].name.should.equal('Recommendations');
    });
  });

  it('should get one resource by id from the database', function() {
    return dbService.findById(1).then(function(resources) {
      resources.length.should.equal(1);
      resources[0].id.should.equal(1);
    });
  });

  it('should create a new resource and return resource category', function() {
    return dbService.create({name: 'Foo'}).then(function(resources) {
      resources[0].id.should.equal(3);
      resources[0].name.should.equal('Foo');
    });
  });

  it('should update an existing resource and return the updated resource', function() {
    return dbService.update(1, {name: 'Foo'}).then(function(resources) {
      resources[0].id.should.equal(1);
      resources[0].name.should.equal('Foo');
    })
  });

  it('should delete an existing resource, returning true', function() {
    return dbService.create({name: 'Foo'}).then(function() {
      return dbService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
