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
var contentItemService;

describe('The contentItemService', function() {
  beforeEach(function(done) {
    dbServices = require('../..')(config);
    contentItemService = dbServices.contentItemService;
    dbServices.models.sequelize.sync({force: true})
      .then(function() {
        mockData.createMockData(dbServices.models)
          .then(function() {
            done();
          });
      });
  });

  it('should get all contentItems from the database', function() {
    return contentItemService.findAll().then(function(contentItems) {
      contentItems.length.should.equal(2);
      contentItems[0].name.should.equal('privacy');
      contentItems[1].name.should.equal('terms');
    });
  });

  it('should get one contentItems by id from the database', function() {
    return contentItemService.findById(1).then(function(contentItems) {
      contentItems.length.should.equal(1);
      contentItems[0].id.should.equal(1);
    });
  });

  it('should create a new contentItems and return contentItems contentItems', function() {
    return contentItemService.create({
      name: 'faq',
      content: 'FAQs'
    }).then(function(contentItems) {
      contentItems[0].id.should.equal(3);
      contentItems[0].content.should.equal('FAQs');
    });
  });

  it('should update an existing contentItems and return the updated contentItems', function() {
    return contentItemService.update(1, {
      content: 'Privacy Policy!'
    }).then(function(contentItems) {
      contentItems[0].id.should.equal(1);
      contentItems[0].content.should.equal('Privacy Policy!');
    })
  });

  it('should delete an existing contentItems, returning true', function() {
    return contentItemService.create({
      name: 'faq',
      content: 'FAQs'
    }).then(function() {
      return contentItemService.destroy(3).then(function(response) {
        response.should.equal(true);
      })
    });
  });

});
