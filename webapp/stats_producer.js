const config = require("./config");
const mongodb = require("./mongodb");

const keywords = require("./tmp_keywords");

function generateStats(freq) {
	let rescheduleTimeout = freq;
	let p = Promise.resolve();
	if(mongodb.db) {
		let db = mongodb.db;
		p = p.then(() => db.collection(config.twitterStatsCollection)
		.find({
			"freq": freq
		})
		.sort({
			"timestamp_ms": -1,
		})
		.limit(1)
		.toArray()
		.then((results) => {
			if(!results.length) {
				return db.collection(config.tweetsCollection)
				.find({})
				.sort({
					"timestamp_ms": 1,
				})
				.limit(1)
				.toArray()
				.then((results) => {
					if(!results.length) {
						return Promise.reject();
					}
					return results[0].timestamp_ms;
				});
			}
			return results[0].timestamp_ms;
		}))
		//p = p.then(() => Promise.resolve(1528363997359))
		.then((last_timestamp_ms) => {
			let proms = [];
			let now = config.fakeNow();
			let ts = last_timestamp_ms + freq
			while(ts < now) {
				for(let kw in keywords) {
				((ts, kw) => {
					proms.push(db.collection(config.tweetsCollection)
						.count({
							"timestamp_ms": {
								"$gte": ts,
								"$lt": ts + freq,
							},
							"retweeted_status.extended_tweet.full_text": keywords[kw].regex,
						})
						/*.count({
						    "timestamp_ms": {
						        "$gte": 1528363997359 + 5000,
						        "$lt": 1528363997359 + 5000 + 100000
						    },
							"retweeted_status.extended_tweet.full_text": /BTC/
						})*/
						.then((count) => {
							return {
								date: ts,
								freq: freq,
								keyword: kw,
								count: count
							};
						}));
				})(ts, kw);
				}
				ts += freq;
			}
			return Promise.all(proms);
		})
		.then((results) => {
			console.error("results: " + JSON.stringify(results, null, 2));
			return results.length ? db.collection(config.twitterStatsCollection)
				.insertMany(results)
			: Promise.resolve();
		})
		.catch((err) => {
			console.error("error: " + err);
		});
	}
	else {
		console.error("disconnected db");
		rescheduleTimeout = 1000;
	}
	p.then(() => setTimeout(generateStats.bind(this, freq), rescheduleTimeout));
}

generateStats(60000);