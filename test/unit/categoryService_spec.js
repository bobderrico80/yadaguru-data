'use strict';

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire').noCallThru();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('The Categories Service', function() {
  var mocks = require('../mocks')('Category');
  var categoryService;

  var categories = [
    {name: 'Essays'},
    {name: 'Tests'}
  ];

  beforeEach(function() {
    mocks.stubMethods();

    categoryService = proxyquire('../../services/categoryService', {
      '../models/': mocks.modelMock
    });
  });

  afterEach(function() {
    mocks.restoreStubs();
  });

  describe('The findAll function', function() {
    it('should resolve with an array of objects representing categories', function() {
      mocks.stubs.Category.findAll.returns(Promise.resolve(categories.map(
        function(category) {
          return {dataValues: category};
        }
      )));

      return categoryService.findAll().should.eventually.deep.equal(categories);
    });

    it('should resolve with an empty array there are no categories', function() {
      mocks.stubs.Category.findAll.returns(Promise.resolve([]));

      return categoryService.findAll().should.eventually.deep.equal([]);
    });
  });

  describe('The findById function', function() {
    it('should resolve with an array with the matching category object', function() {
      mocks.stubs.Category.findById.withArgs(1)
        .returns(Promise.resolve({dataValues: categories[0]}));

      return categoryService.findById(1).should.eventually.deep.equal([categories[0]]);
    });

    it('should resolve with an empty array if no categories were found', function() {
      mocks.stubs.Category.findById.withArgs(3)
        .returns(Promise.resolve(null));

      return categoryService.findById(3).should.eventually.deep.equal([]);
    });
  });

  describe('The create function', function() {
    var newCategory = {
      name: 'Essays'
    };

    it('should resolve with an array containing the new category object', function() {
      mocks.stubs.Category.create.withArgs(newCategory)
        .returns(Promise.resolve({dataValues: newCategory}));

      return categoryService.create(newCategory).should.eventually.deep.equal([newCategory]);
    });
  });

  describe('The update function', function() {
    var row, update;
    var updatedCategory = {
      name: 'Essays'
    };

    var idToUpdate = 1;

    beforeEach(function() {
      row = {update: function(){}};
      update = sinon.stub(row, 'update');
    });

    afterEach(function() {
      update.restore();
    });

    it('should resolve with an array containing the updated category object', function() {
      mocks.stubs.Category.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(row));
      update.withArgs(updatedCategory)
        .returns(Promise.resolve({dataValues: updatedCategory}));

      return categoryService.update(idToUpdate, updatedCategory).should.eventually.deep.equal([updatedCategory]);
    });

    it('should resolve with false if the id does not exist', function() {
      mocks.stubs.Category.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(null));

      return categoryService.update(idToUpdate, updatedCategory).should.eventually.be.false;
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
      mocks.stubs.Category.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(row));
      destroy.withArgs()
        .returns(Promise.resolve(undefined));

      return categoryService.destroy(idToDestroy).should.eventually.be.true;
    });

    it('should resolve with false id does not exist', function() {
      mocks.stubs.Category.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(null));

      return categoryService.destroy(idToDestroy).should.eventually.be.false;
    });
  });
});
