'use strict';

var moment = require('moment');

module.exports = function(models) {
  var outputSanitizer = function(school) {
    school.dueDate = moment.utc(school.dueDate).format('YYYY-MM-DD');
    return school;
  };

  return require('./baseDbService')(models.School, outputSanitizer);
};
