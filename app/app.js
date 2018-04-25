/** 
 * Copyright (C) 2017 Menome Technologies Inc.  
 * 
 * A microservice that runs cypher queries periodically.
 */
"use strict";
var Bot = require('@menome/botframework')
var configSchema = require('./config');
var config = require('../config/config.json');
var Scheduler = require('./scheduler');

var paths = { }

// Loader. So we don't have to individually require each file.
var normalizedPath = require("path").join(__dirname, "controllers");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  paths = Object.assign(paths,require("./controllers/" + file).swaggerDef);
});

var bot = new Bot({
  config: {
    name: "Neo4j Crony Bot",
    desc: "Runs cypher queries on a Cron-like schedule.",
    ...config
  }, 
  configSchema
});

// Start Cron
var sched = new Scheduler(bot);
sched.schedule(bot.config.get("tasks"));

// Let our middleware use these.
bot.web.use((req,res,next) => {
  req.scheduler = sched;
  next();
});

bot.registerPaths(paths,__dirname+"/controllers");

bot.start();
bot.changeState({state: "idle"})
