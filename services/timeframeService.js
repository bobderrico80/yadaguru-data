'use strict';
var moment = require('moment');

module.exports = function(models) {
  var outputSanitizer = function(timeframe) {
    if (timeframe.type === 'absolute') {
      timeframe.formula = moment.utc(timeframe.formula).format('YYYY-MM-DD');
    }
    return timeframe;
  };

  return require('./baseDbService')(models.Timeframe, outputSanitizer);
};
