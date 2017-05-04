'use strict';

var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var TestDate = sequelize.define('TestDate', {
    registrationDate: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment.utc(this.getDataValue('registrationDate')).format('YYYY-MM-DD');
      }
    },
    adminDate: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment.utc(this.getDataValue('adminDate')).format('YYYY-MM-DD');
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        TestDate.belongsTo(models.Test, {
          onDelete: 'restrict',
          foreignKey: {
            name: 'testId',
            allowNull: false
          }
        });
      }
    }
  });
  return TestDate;
};
