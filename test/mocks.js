'use strict';

var sinon = require('sinon');

module.exports = function(resource) {
  var modelMock = {};
  addResource(resource);

  var rowMocksStubbed = false;
  var bcryptMocksStubbed = false;

  var rowMock = {
    update: function(){},
    destroy: function(){}
  };

  var bcryptMock = {
    genSaltSync: function(){},
    hashSync: function(){},
    compareSync: function(){}
  };

  var stubs = {};

  var stubMethods = function(_resource) {
    _resource = _resource || resource;
    stubs[_resource] = {};
    stubs[_resource].findAll = sinon.stub(modelMock[_resource], 'findAll');
    stubs[_resource].findOne = sinon.stub(modelMock[_resource], 'findOne');
    stubs[_resource].findById = sinon.stub(modelMock[_resource], 'findById');
    stubs[_resource].create = sinon.stub(modelMock[_resource], 'create');
    stubs[_resource].bulkCreate = sinon.stub(modelMock[_resource], 'bulkCreate');

    if (!rowMocksStubbed) {
      stubs.update = sinon.stub(rowMock, 'update');
      stubs.destroy = sinon.stub(rowMock, 'destroy');
      rowMocksStubbed = true;
    }

    if (!bcryptMocksStubbed) {
      stubs.bcrypt = {};
      stubs.bcrypt.genSaltSync = sinon.stub(bcryptMock, 'genSaltSync');
      stubs.bcrypt.hashSync = sinon.stub(bcryptMock, 'hashSync');
      stubs.bcrypt.compareSync = sinon.stub(bcryptMock, 'compareSync');
      bcryptMocksStubbed = true;
    }
  };

  var restoreStubs = function(_resource) {
    _resource = _resource || resource;

    stubs[_resource].findAll.restore();
    stubs[_resource].findOne.restore();
    stubs[_resource].findById.restore();
    stubs[_resource].create.restore();
    stubs[_resource].bulkCreate.restore();
    stubs.update.restore();
    stubs.destroy.restore();
    stubs.bcrypt.genSaltSync.restore();
    stubs.bcrypt.hashSync.restore();
    stubs.bcrypt.compareSync.restore();
  };

  function addResource(resource) {
    modelMock[resource] = {
      findAll: function(){},
      findOne: function(){},
      findById: function(){},
      create: function(){},
      bulkCreate: function(){}
    };
  };

  return {
    modelMock: modelMock,
    rowMock: rowMock,
    bcryptMock: bcryptMock,
    stubs: stubs,
    stubMethods: stubMethods,
    restoreStubs: restoreStubs,
    addResource: addResource
  }
}


