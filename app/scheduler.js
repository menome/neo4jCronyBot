/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Schedules queries using cron.
 */
"use strict";
var cron = require('cron');
var decypher = require('decypher/loader');
var logger = require('./logger')

module.exports = function(bot) {
  // Keep our running jobs in here.
  var runningJobs=0;
  var _jobs = [];
  var _tasks = [];

  function runTask(task) {
    bot.changeState({state: "working"})
    if(task.queryFile) {
      var taskQueries;
      try {
        taskQueries = decypher("./config/queries/"+task.queryFile);
      }
      catch(err) {
        return Promise.reject(err);
      }
      
      var queryList = [];
      var paramList = [];

      // Put all the queries into a list for batch execution.
      var keys = Object.keys(taskQueries);
      for(var i = 0; i < keys.length; i++) {
        queryList.push(taskQueries[keys[i]]);
        paramList.push(task.queryParams);
      }
      if(paramList){
        bot.logger.info("Running queries:", queryList, paramList);
      }else{
        bot.logger.info("Running Queries:",queryList);
      }

      // Run them all in the same session.
      return bot.neo4j.batchQuery(queryList,paramList);
    }

    return bot.neo4j.query(task.query, task.queryParams);
  }

  // Schedule our tasks to run.
  this.schedule = function(tasks) {
    bot.logger.info("Setting up task schedule.");
    _tasks = tasks;
    tasks.forEach((task, idx) => {
      _jobs[idx] = new cron.CronJob({
        cronTime: task.cronTime,
        onTick: function() {
          bot.logger.info("Running Job:", task.name);
          return runTask(task).then((results) => {
            bot.changeState({state: "idle"})
            bot.logger.info("Job Finished:", task.name);
            logger.log({
              level: "verbose", 
              message: "Finished", 
              taskname: task.name, 
              results
            });
          }).catch((err) => {
            bot.changeState({state: "idle"})
            bot.logger.error("Job Failed:", task.name);
            bot.logger.error(err);
          })
        },
        start: !task.disable,
        timeZone: task.timeZone,
      })
    })
    bot.logger.info("Scheduled all tasks.");
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
