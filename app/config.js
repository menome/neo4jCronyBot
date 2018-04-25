/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";

// Export the config.
module.exports = {
  tasks: {
    doc: "Array of scheduled task definitions.",
    default: [],
    format: function check(tasks) {
      tasks.forEach((task) => {
        if((typeof task.name) !== 'string' || (typeof task.cronTime) !== 'string') 
          throw new Error('Tasks must have a name and cronTime property.');

        if((typeof task.query) !== 'string' && (typeof task.queryFile) !== 'string')
          throw new Error("Tasks must have one of 'query' or 'queryFile'")

        if(task.desc && typeof task.desc !== 'string') 
          throw new Error('Task description must be a string');

        if(task.timeZone && typeof task.timeZone !== 'string') 
          throw new Error('Timezone must be a string');
      
        if(task.disable !== undefined && typeof task.disable !== 'boolean') 
          throw new Error('Disable must be a boolean');
      })
    }
  }
};