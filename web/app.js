"use strict";

var express = require("express");
var app = express();
var nosql = require("nosql");
var config = require("../shared/shared").config;
var db = nosql.load(config.dbPath)

app.use(express.static("public"));

app.get("/api/readings", function (req, res) {

	var viewName;
	switch(parseInt(req.query.lastHours)) {
		case 6:
			viewName = "last6Hours";
			break;
		case 12:
			viewName = "last12Hours";
			break;
		case 24:
			viewName = "last24Hours";
			break;
		default:
			viewName = "last24Hours";
	}

	db.views.all(viewName, function (err, docs, count) {
		if (err) {
			res.send(err);
		}

		// Handle sensor mappings (rename sensor ID to custom name)
		mapSensorIds(docs);

		res.json(docs);
	});

});

app.get("*", function (req, res) {
	res.sendfile("./public/index.html");
});

function mapSensorIds(docs) {
	var sensorMappings = config.sensorMapping;
	if (sensorMappings.length > 0) {
		for (var doc of docs) {
			var foundSensorMappings = sensorMappings.filter(function (sensorMapping) {
				return sensorMapping.id === doc.sensorId;
			});
			if (foundSensorMappings.length > 0) {
				doc.sensorId = foundSensorMappings[0].name;
			}
		}
	}
}

app.listen(config.port);
console.log("Listening on port %s...".replace("%s", config.port));