'use strict';

var sinon = require('sinon');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire').noCallThru();
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.should();

describe('The Timeframes Service', function() {
  var mocks = require('../mocks')('Timeframe');
  var timeframeService;

  var timeframes =[{
    id: 1,
    name: 'Today',
    type: 'now',
    formula: undefined
  }, {
    id: 2,
    name: 'In 30 Days',
    type: 'relative',
    formula: '30'
  }, {
    id: 3,
    name: 'January 1',
    type: 'absolute',
    formula: '2017-01-01'
  }];

  beforeEach(function() {
    mocks.stubMethods();

    timeframeService = proxyquire('../../services/timeframeService', {
      '../models/': mocks.modelMock
    });
  });

  afterEach(function() {
    mocks.restoreStubs();
  });

  describe('The findAll function', function() {
    it('should resolve with an array of objects representing timeframes', function() {
      mocks.stubs.Timeframe.findAll.returns(Promise.resolve(timeframes.map(
        function(timeframe) {
          return {dataValues: timeframe};
        }
      )));

      return timeframeService.findAll().should.eventually.deep.equal(timeframes);
    });

    it('should resolve with an empty array there are no timeframes', function() {
      mocks.stubs.Timeframe.findAll.returns(Promise.resolve([]));

      return timeframeService.findAll().should.eventually.deep.equal([]);
    });
  });

  describe('The findById function', function() {
    it('should resolve with an array with the matching timeframe object', function() {
      mocks.stubs.Timeframe.findById.withArgs(1)
        .returns(Promise.resolve({dataValues: timeframes[0]}));

      return timeframeService.findById(1).should.eventually.deep.equal([timeframes[0]]);
    });

    it('should resolve with an empty array if no timeframes were found', function() {
      mocks.stubs.Timeframe.findById.withArgs(3)
        .returns(Promise.resolve(null));

      return timeframeService.findById(3).should.eventually.deep.equal([]);
    });
  });

  describe('The create function', function() {
    var newTimeframe = {
      name: 'Today',
      type: 'now',
      formula: undefined
    };

    it('should resolve with an array containing the new timeframe object', function() {
      mocks.stubs.Timeframe.create.withArgs(newTimeframe)
        .returns(Promise.resolve({dataValues: newTimeframe}));

      return timeframeService.create(newTimeframe).should.eventually.deep.equal([newTimeframe]);
    });
  });

  describe('The update function', function() {
    var row, update, idToUpdate;

    var updatedTimeframe = {
      name: 'Today',
      type: 'now',
      formula: undefined
    };

    idToUpdate = 1;

    before(function() {
      row = {update: function(){}};
      update = sinon.stub(row, 'update');
    });

    after(function() {
      update.restore();
    });

    it('should resolve with an array containing the updated timeframe object', function() {
      mocks.stubs.Timeframe.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(row));
      update.withArgs(updatedTimeframe)
        .returns(Promise.resolve({dataValues: updatedTimeframe}));

      return timeframeService.update(idToUpdate, updatedTimeframe).should.eventually.deep.equal([updatedTimeframe]);
    });

    it('should resolve with false if the id does not exist', function() {
      mocks.stubs.Timeframe.findById.withArgs(idToUpdate)
        .returns(Promise.resolve(null));

      return timeframeService.update(idToUpdate, updatedTimeframe).should.eventually.be.false;
    });
  });

  describe('The destroy function', function() {
    var row, destroy;

    var idToDestroy = 1;

    before(function() {
      row = {destroy: function(){}};
      destroy = sinon.stub(row, 'destroy');
    });

    after(function() {
      destroy.restore();
    });

    it('should resolve with true when the row is destroyed', function() {
      mocks.stubs.Timeframe.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(row));
      destroy.withArgs()
        .returns(Promise.resolve(undefined));

      return timeframeService.destroy(idToDestroy).should.eventually.be.true;
    });

    it('should resolve with false id does not exist', function() {
      mocks.stubs.Timeframe.findById.withArgs(idToDestroy)
        .returns(Promise.resolve(null));

      return timeframeService.destroy(idToDestroy).should.eventually.be.false;
    });
  });
});
