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
var _jobs = [];
var _tasks = [];

// Schedule our tasks to run.
module.exports.schedule = function(tasks) {
  _tasks = tasks;
  tasks.forEach((task, idx) => {
    _jobs[idx] = new cron.CronJob({
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

// Get a list of our running tasks.
module.exports.getTasks = function() {
  var retVal = [];

  _jobs.forEach((job,idx) => {
    if(!job || !job.running) return;
    retVal.push(_tasks[idx])
  })

  return retVal;
}