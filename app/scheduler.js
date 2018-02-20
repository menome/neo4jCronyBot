/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Schedules queries using cron.
 */
"use strict";
var bot = require('@menome/botframework')
var config = require('./config');
var cron = require('cron');

// Keep our running jobs in here.
var jobs = [];

module.exports.schedule = function(tasks) {
  tasks.forEach((task, idx) => {
    jobs[idx] = new cron.CronJob({
      cronTime: task.cronTime,
      onTick: function() {
        bot.logger.info("Running Job:", task.name);
        return bot.query(task.query, task.queryParams).then((result) => {
          bot.logger.info("Job Finished:", task.name);
          // bot.logger.info("Job Finished: ", result);
        }).catch((err) => {
          bot.logger.error("Job Failed:", task.name);
          bot.logger.error("Error:", err);
        })
      },
      start: !task.disable,
      timeZone: task.timeZone,
    })
  })
}

module.exports.getTasks = function() {
  return jobs;
}