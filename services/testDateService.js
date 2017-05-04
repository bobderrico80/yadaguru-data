'use strict';

var moment = require('moment');

module.exports = function(models) {
  var TestDate = models.TestDate;
  var Test = models.Test;

  var testDateService = require('./baseDbService')(TestDate);

  testDateService.findAll = function() {
    return TestDate.findAll({
      include: Test
    }).then(function(rows) {
      return rows.map(function(row) {
        return {
          id: row.id,
          testId: row.testId,
          registrationDate: _formatDate(row.registrationDate),
          adminDate: _formatDate(row.adminDate),
          type: row.Test.type,
          registrationMessage: row.Test.registrationMessage,
          registrationDetail: row.Test.registrationDetail,
          adminMessage: row.Test.adminMessage,
          adminDetail: row.Test.adminDetail
        }
      });
    })
  };

  function _formatDate(date) {
    return moment.utc(date).format('YYYY-MM-DD');
  }

  return testDateService;
};
