const mongodb = require("./mongodb");
const config = require("./config");

const availableKeywords = require("./tmp_keywords");

function queryTweetsByKeywordInIntervals(kw) {
	function queryTweetsInIntervals(ivs) {
		if(!mongodb.db) {
			return Promise.reject();
		}
		let min = Math.min(...ivs.map((x) => x[0]));
		let max = Math.max(...ivs.map((x) => x[1]));
		return mongodb.db.collection(config.twitterStatsCollection)
			.find({
				date: {
					"$gte": min,
					"$lt": max,
				},
				keyword: kw,
			})
			.toArray()
			.then((results) => {
				console.error("size of results tweets with " + kw + " in interval (" + min + "," + max + "): " + results.length);
				return results;
			});
	}
	return queryTweetsInIntervals;
}

let series = {};
for(let kw in availableKeywords) {
	series["twitter_keyword_" + kw] = {
		queryInIntervals: queryTweetsByKeywordInIntervals(kw),
		persistence: 100,
		frequency: 60000,
	};
}

function newClient(socket) {
	socket.emit("available_keywords", Object.keys(availableKeywords));
}

module.exports = {
	newClient: newClient,
	series: series,
};