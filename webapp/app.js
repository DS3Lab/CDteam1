let express = require("express");
let path = require("path");
let historicalRouter = require("./historical_router.js");
let realtimeRouter = require("./realtime_router.js");
let app = express();
var http = require('http').Server(app);
let io = require("socket.io")(http);
let twitterData = require("./twitter_data.js")(io);

/*io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});*/

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static("public"));

app.use("/historical", historicalRouter);
app.use("/realtime", realtimeRouter);
app.get("/twitter", (req, res) => {
	return res.render("twitter_plot");
});

http.listen(3000, "0.0.0.0");
