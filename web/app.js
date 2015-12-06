var express = require("express");
var app = express();

var NeDB = require("nedb");
var config = require("../config/config");
var db = new NeDB({ filename: config.dbPath, autoload: true });

app.use(express.static("public"));

app.get("/api/readings", function (req, res) {
	db.find({}).sort({ timestamp: 1 }).exec(function (err, docs) {
		if (err) {
			res.send(err);
		}

		res.json(docs);
	});
});

app.get("*", function (req, res) {
	res.sendfile("./public/index.html");
});

app.listen(config.port);
console.log("Listening on port %s...".replace("%s", config.port));