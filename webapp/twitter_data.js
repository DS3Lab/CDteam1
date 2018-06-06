let DB_CONNECTION_RETRY_DELAY = 3000;
let DEBUG_TIME_LAG = 22 * 3600 * 1000;
let TIME_DELTA = 3 * 1000; // milliseconds
let INITIAL_PERIODS = 50;

const PriorityQueue = require("priorityqueuejs");
const SortedArray = require("sorted-array");
const mongodb = require("./mongodb.js");

let initialized = false;

let savedData = {};

function clearData(key) {
	savedData[keys].array.length = 0;
}

function saveData(key, records) {
	//console.log("records: " + JSON.stringify(records, null, 2));
	if(Object.keys(savedData).indexOf(key) == -1) {
		savedData[key] = new SortedArray((a, b) => (a.date > b.date) ? 1 : -1);
	}
	let sa = savedData[key];
	records.forEach((record) => sa.insert(record));
	while(sa.array.length > INITIAL_PERIODS) {
		sa.array.shift();
	}
}

function queryTweetsInIntervals(ivs) {
	if(!mongodb.db) {
		return Promise.reject();
	}
	return (() => {
	let p = Promise.resolve();
	let counts = [];
	for(let iv of ivs) {
	((iv) => {
		p = p.then(() => mongodb.db.collection("cleaned_tweets")
		.count({
			"timestamp_ms": {
				"$gte": iv[0],
				"$lt": iv[1],
			}
		})
		.then((count) => {
			counts.push({
				"date": iv[1],
				"count": count,
			});
			//console.log("count: " + count);
		}))
		.catch((err) => {});
	})(iv);
	}
	return p.then(() => {
		//console.log("counts: " + JSON.stringify(counts, null, 2));
		let dummy_counts = counts.map((c) => ({
			date: c.date,
			count: c.count * Math.random()
		}));
		return [ counts, dummy_counts ];
	})
	.catch((err) => {});
	})();
}

function emitAll(emitter) {
	for(let key in savedData) {
		emitter.emit(key, savedData[key].array);
	}
}

function emitLast(emitter) {
	for(let key in savedData) {
		emitter.emit(key, savedData[key].array.slice(-1));
	}
}

function initializeTwitterStats() {
	let now = Date.now() - DEBUG_TIME_LAG;
	let ivs = [];
	//console.log("trying initialization");
	for(let i = INITIAL_PERIODS; i > 0; i--) {
		ivs.push([ now - i * TIME_DELTA, now - (i - 1) * TIME_DELTA ]);
	}
	return queryTweetsInIntervals(ivs)
	.then((results) => {
		saveData("twitter_counts", results[0]);
		saveData("dummy_twitter_counts", results[1]);
	})
	.catch(() => {
		return new Promise((resolve, reject) => setTimeout(() => resolve(), DB_CONNECTION_RETRY_DELAY))
		.then(initializeTwitterStats);
	});
}

module.exports = ((io) => {
	function broadcastTwitterStats() {
		let now = Date.now() - DEBUG_TIME_LAG;
		//console.log("broadcasting stats");
		return queryTweetsInIntervals([ [ now - TIME_DELTA, now ] ])
		.then((results) => {
			saveData("twitter_counts", results[0]);
			saveData("dummy_twitter_counts", results[1]);
		})
		.then(() => emitLast(io))
		.catch((e) => { console.log("problem: " + e); })
		.then(() => setTimeout(broadcastTwitterStats, TIME_DELTA));
	}

	io.on("connection", (socket) => {
		//console.log("new connection");
		emitAll(socket);
	});

	initializeTwitterStats();
	broadcastTwitterStats();
});