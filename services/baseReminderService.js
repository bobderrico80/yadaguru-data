'use strict';

module.exports = function(models) {
  var BaseReminder = models.BaseReminder;
  var Timeframe = models.Timeframe;
  var Category = models.Category;
  var baseReminderService = require('./baseDbService')(BaseReminder);

  baseReminderService.findAll = function() {
    return BaseReminder.findAll({include: [Timeframe, Category]})
      .then(function(baseReminders) {
        return baseReminders.map(function(baseReminder){
          var json = baseReminder.toJSON();
          json.timeframeIds = [];
          json.timeframes = [];
          json.Timeframes.forEach(function(Timeframe) {
            json.timeframeIds.push(Timeframe.id);
            json.timeframes.push(Timeframe.name);
          })
          json.categoryName = baseReminder.Category.name;
          delete json.Timeframes;
          delete json.Category;
          return json;
        });
      })
  }

  baseReminderService.findAllIncludingTimeframes = function() {
    return BaseReminder.findAll({include: Timeframe}).then(function(resp) {
      var baseReminders = resp.map(function(resp) {
        return resp;
      });

      return baseReminders.map(function(baseReminder) {
        baseReminder.timeframes = baseReminder.Timeframes.map(function(timeframeResp) {
          return {
            id: timeframeResp.id,
            name: timeframeResp.name,
            type: timeframeResp.type,
            formula: timeframeResp.formula
          }
        });
        delete baseReminder.Timeframes;
        return baseReminder;
      })
    })
  };

  baseReminderService.findById = function(id) {
    return BaseReminder.findById(id, {include: [Timeframe, Category]}).then(function(baseReminder) {
      if (!baseReminder) {
        return [];
      }

      var json = baseReminder.toJSON();

      json.timeframeIds = baseReminder.Timeframes.map(function(timeframeResp) {
        return timeframeResp.id;
      });
      json.timeframes = baseReminder.Timeframes.map(function(timeframeResp) {
        return timeframeResp.name;
      });
      json.categoryName = baseReminder.Category.name;
      delete json.Timeframes;
      delete json.Category;
      return [json];

    });
  };

  baseReminderService.create = function(data) {
    var timeframes = data.timeframeIds;

    return BaseReminder.create(data).then(function(newBaseReminder) {
      return newBaseReminder.setTimeframes(timeframes).then(function() {
        var json = newBaseReminder.toJSON();
        json.timeframeIds = data.timeframeIds;
        return [json];
      });
    });
  };

  baseReminderService.update = function(id, data) {
    return BaseReminder.findById(id).then(function(baseReminder) {
      if (!baseReminder) {
        return Promise.resolve(false);
      }

      return baseReminder.update(data).then(function(updatedBaseReminder) {
        var json = updatedBaseReminder.toJSON();
        if (data.timeframeIds) {
          return updatedBaseReminder.setTimeframes(data.timeframeIds).then(function() {
            json.timeframeIds = data.timeframeIds;
            return [json];
          });
        }
        return updatedBaseReminder.getTimeframes().then(function(timeframes) {
          json.timeframeIds = timeframes.map(function(timeframe) {
            return timeframe.id;
          });
          return [json];
        })
      })
    })
  };

  baseReminderService.destroy = function(id) {
    return BaseReminder.findById(id).then(function(baseReminder) {
      if (!baseReminder) {
        return Promise.resolve(false);
      }

      return baseReminder.setTimeframes([]).then(function() {
        return baseReminder.destroy().then(function() {
          return true;
        })
      })

    })
  };

  return baseReminderService;
};
