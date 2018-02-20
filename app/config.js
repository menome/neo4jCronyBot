/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";
var convict = require('convict');
var fs = require('fs');
var bot = require('@menome/botframework')

var config = convict({
  port: bot.configSchema.port,
  logging: bot.configSchema.logging,
  rabbit: bot.configSchema.rabbit,
  neo4j: bot.configSchema.neo4j,
  tasks: {
    doc: "Array of scheduled task definitions.",
    default: [],
    format: function check(tasks) {
      tasks.forEach((task) => {
        if((typeof task.name) !== 'string' || (typeof task.query) !== 'string' || (typeof task.cronTime) !== 'string') 
          throw new Error('Tasks must have a name, query, and cronTime property.');

        if(task.desc && typeof task.desc !== 'string') 
          throw new Error('Task description must be a string');

        if(task.timeZone && typeof task.timeZone !== 'string') 
          throw new Error('Timezone must be a string');
      
        if(task.disable !== undefined && typeof task.disable !== 'boolean') 
          throw new Error('Disable must be a boolean');
      })
    }
  }
})

// Load from file.
if (fs.existsSync('./config/config.json')) {
  config.loadFile('./config/config.json');
  config.validate();
}

// Export the config.
module.exports = config;