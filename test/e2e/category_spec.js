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
var categoryService;

describe('The categoryService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    categoryService = dbServices.categoryService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all categories from the database', function() {
    return categoryService.findAll().then(function(categories) {
      categories.length.should.equal(2);
      categories[0].name.should.equal('Essays');
      categories[1].name.should.equal('Recommendations');
    });
  });

  it('should get one category by id from the database', function() {
    return categoryService.findById(1).then(function(categories) {
      categories.length.should.equal(1);
      categories[0].id.should.equal(1);
    });
  });

  it('should create a new category and return category category', function() {
    return categoryService.create({name: 'Foo'}).then(function(categories) {
      categories[0].id.should.equal(3);
      categories[0].name.should.equal('Foo');
    });
  });

  it('should update an existing category and return the updated category', function() {
    return categoryService.update(1, {name: 'Foo'}).then(function(categories) {
      categories[0].id.should.equal(1);
      categories[0].name.should.equal('Foo');
    })
  });

  it('should delete an existing category, returning true', function() {
    return categoryService.create({name: 'Foo'}).then(function() {
      return categoryService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
