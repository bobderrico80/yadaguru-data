'use strict';

module.exports = function(models) {
  return require('./baseDbService')(models.ContentItem);
};
