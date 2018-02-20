/** 
 * Copyright (C) 2017 Menome Technologies Inc.  
 * 
 * A microservice that runs cypher queries periodically.
 */
"use strict";
var bot = require('@menome/botframework')
var config = require('./config');
var scheduler = require('./scheduler');

// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "Neo4j Crony Bot",
  desc: "Runs cypher queries on a Cron-like schedule.",
  logging: config.get('logging'),
  port: config.get('port'),
  neo4j: config.get('neo4j')
});

// Let people see what jobs are scheduled.
// TODO: Choke this. Only show what queries are actually being executed and when.
bot.registerEndpoint({
  "name": "Get Jobs",
  "path": "/jobs",
  "method": "GET",
  "desc": "Gets a list of configured jobs."
}, function(req,res) {
  var taskDef = config.get("tasks");

  res.send(
    bot.responseWrapper({
      status: "success",
      message: "Getting List of Jobs",
      data: taskDef
    })
  )
})

// Start Cron
scheduler.schedule(config.get("tasks"));

// Start the bot.
bot.start();
bot.changeState({state: "idle"})
