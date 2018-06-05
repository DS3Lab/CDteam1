let config = {};
let username = "***";
let password = "***";
let hostPort = "***";
let dbName =  "***";
config.mongodb_url = "mongodb://" + username + ":" + encodeURIComponent(password) + "@" + hostPort + "/" + dbName;

module.exports = config;