var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://CDteam1:" + encodeURIComponent('') + "@spaceml4.ethz.ch:27017/CDteam1DB"

function connect(onDisconnect) {
	return new Promise((resolve, reject) => {	
		return MongoClient.connect(url)
		.then((client) => {
			db = client.db("CDteam1DB");
			resolve(db);
		})
		.catch((err) => {
			console.error("db connection failed: " + err);
			reject(err);
		});
	});
}

let exps = {
	db: null,
};
connect()
.then((db) => {
	exps.db = db
	console.log("connected to db");
});

module.exports = exps;