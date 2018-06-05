let mongodb = require("./mongodb.js");
let timedelta = 5; // seconds

module.exports = ((io) => {
	function broadcastTwitterStats() {
		let p = Promise.resolve();
		if(mongodb.db) {
			p = p.then(mongodb.db.collection("foo")
				.count({
					"timestamp_ms": { "$gt": (Date.now() - timedelta * 1000) + "" }
				})
				.then((count) => {
					//console.log("count: " + count);
					io.emit("twitter_count", count);
				}))
				.catch(() => {});
		}
		return p.then(() => setTimeout(broadcastTwitterStats, timedelta * 1000));
	}
	broadcastTwitterStats();
});