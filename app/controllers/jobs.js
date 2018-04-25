const helpers = require('@menome/botframework/helpers');

module.exports.swaggerDef = {
  "/jobs": {
    "x-swagger-router-controller": "jobs",
    "get": {
      "description": "Gets a list of configured jobs.",
      "tags": [
        "Jobs"
      ],
      "responses": {
        "200": {
          "description": "Success"
        },
        "default": {
          "description": "Error"
        }
      }
    }
  }
}

module.exports.get = function(req,res) {
  var taskDef = req.scheduler.getTasks()

  res.send(helpers.responseWrapper({
      status: "success",
      message: "Retrieved List of Jobs",
      data: taskDef
    })
  )
}