/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Schedules queries using cron.
 */
"use strict";
var cron = require('cron');
var decypher = require('decypher/loader');

module.exports = function(bot) {
  // Keep our running jobs in here.
  var _jobs = [];
  var _tasks = [];

  function runTask(task) {
    if(task.queryFile) {
      var taskQueries = decypher("./config/queries/"+task.queryFile);
    
      var queryList = [];
      var paramList = [];

      // Put all the queries into a list for batch execution.
      var keys = Object.keys(taskQueries);
      for(var i = 0; i < keys.length; i++) {
        queryList.push(taskQueries[keys[i]]);
        paramList.push(task.queryParams);
      }

      console.log(queryList, paramList)

      // Run them all in the same session.
      return bot.neo4j.batchQuery(queryList,paramList);
    }

    return bot.neo4j.query(task.query, task.queryParams);
  }

  // Schedule our tasks to run.
  this.schedule = function(tasks) {
    _tasks = tasks;
    tasks.forEach((task, idx) => {
      _jobs[idx] = new cron.CronJob({
        cronTime: task.cronTime,
        onTick: function() {
          bot.logger.info("Running Job:", task.name);
          return runTask(task).then((result) => {
            bot.logger.info("Job Finished:", task.name);
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
  this.getTasks = function() {
    var retVal = [];

    _jobs.forEach((job,idx) => {
      if(!job || !job.running) return;
      retVal.push(_tasks[idx])
    })

    return retVal;
  }
}
