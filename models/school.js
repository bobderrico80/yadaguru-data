'use strict';

var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var School = sequelize.define('School', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    dueDate: {
      allowNull: false,
      type: DataTypes.DATE,
      get: function() {
        return moment.utc(this.getDataValue('dueDate')).format('YYYY-MM-DD');
      }
    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        School.belongsTo(models.User, {
          onDelete: 'cascade',
          foreignKey: {
            name: 'userId',
            allowNull: false
          }
        });
        School.hasMany(models.Reminder, {
          onDelete: 'cascade',
          foreignKey: {
            name: 'schoolId',
            allowNull: false
          }
        });
      }
    }
  });
  return School;
};
