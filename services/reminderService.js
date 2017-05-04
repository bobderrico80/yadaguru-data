'use strict';
var moment = require('moment');

module.exports = function(models) {
  var Reminder = models.Reminder;
  var BaseReminder = models.BaseReminder;
  var Category = models.Category;
  var School = models.School;

  var reminderService = require('./baseDbService')(Reminder);

  function getReminderResponse(row) {
    return {
      id: row.id,
      dueDate: moment.utc(row.dueDate).format('YYYY-MM-DD'),
      timeframe: row.timeframe,
      name: row.BaseReminder.name,
      message: row.BaseReminder.message,
      detail: row.BaseReminder.detail,
      lateMessage: row.BaseReminder.lateMessage,
      lateDetail: row.BaseReminder.lateDetail,
      category: row.BaseReminder.Category.name,
      baseReminderId: row.BaseReminder.id,
      schoolName: row.School.name,
      schoolId: row.School.id,
      schoolDueDate: row.School.dueDate,
      userId: row.userId
    }
  }

  reminderService.findByDateWithBaseReminders = function(date) {
    return Reminder.findAll({
      where: {
        dueDate: date
      },
      include: [{
        model: BaseReminder,
        include: {
          model: Category
        }
      }, {
        model: School
      }]
    }).then(function(rows) {
      return rows.map(function(row) {
        return getReminderResponse(row);
      })
    })
  }

  reminderService.findByDateForUserWithBaseReminders = function(date, userId) {
    return Reminder.findAll({
      where: {
        dueDate: date,
        userId: userId
      },
      include: [{
        model: BaseReminder,
        include: {
          model: Category
        }
      }, {
        model: School
      }]
    }).then(function(rows) {
      return rows.map(function(row) {
        return getReminderResponse(row);
      })
    })
  }

  reminderService.findByUserWithBaseReminders = function(userId) {
    return Reminder.findAll({
      where: {
        userId: userId
      },
      include: [{
        model: BaseReminder,
        include: {
          model: Category
        }
      }, {
        model: School
      }]
    }).then(function(rows) {
      return rows.map(function(row) {
        return getReminderResponse(row);
      })
    })
  };

  reminderService.findByIdForUserWithBaseReminders = function(id, userId) {
    return Reminder.findAll({
      where: {
        id: id,
        userId: userId
      },
      include: [{
        model: BaseReminder,
        include: {
          model: Category
        }
      }, {
        model: School
      }]
    }).then(function(rows) {
      return rows.map(function(row) {
        return getReminderResponse(row);
      });
    })
  };

  reminderService.findByUserForSchoolWithBaseReminders = function(schoolId, userId) {
    return Reminder.findAll({
      where: {
        userId: userId,
        schoolId: schoolId
      },
      include: [{
        model: BaseReminder,
        include: {
          model: Category
        }
      }, {
        model: School
      }]
    }).then(function(rows) {
      return rows.map(function(row) {
        return getReminderResponse(row);
      });
    });
  };

  return reminderService;
};
