"use strict";

var express = require("express");
var app = express();
var nosql = require("nosql");
var config = require("../shared/shared").config;
var db = nosql.load(config.dbPath)

app.use(express.static("public"));

app.get("/api/readings", function (req, res) {

	db.views.all("last24Hours", function (err, docs, count) {
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