"use strict";

var nosql = require("nosql");
var fs = require("fs");
var config = require("../shared/shared").config;
var db = nosql.load(config.dbPath);

const DEVICES_PATH = config.devicesPath;
const SENSOR_DIRECTORY_MASK = "28-";
const SENSOR_PATH = DEVICES_PATH + "%s/w1_slave";

function readDir(path) {
	return new Promise(function (resolve, reject) {
		fs.readdir(DEVICES_PATH, function (err, entries) {
			return err ? reject(err) : resolve(entries);
		});
	});
}

function readFile(file) {
	return new Promise(function (resolve, reject) {
		fs.readFile(SENSOR_PATH.replace("%s", file), "utf8", function (err, fileContent) {
			return err ? reject(err) : resolve(fileContent);
		});
	});
}

function parseFileContent(fileContent) {
	var lines = fileContent.match(/[^\r\n]+/g);
	var correctMeasurement = lines.length == 2 && lines[0].indexOf("YES") >= 0;
	if (!correctMeasurement) {
		return;
	}

	var regexResult = /t=([0-9]+)/.exec(lines[1]);
	var sensorValue = regexResult.length >= 2 ? regexResult[1] : null;
	if (sensorValue == null) {
		return;
	}

	var temperatureDocument = {
		sensorId: 1337, // TODO: get the sensor id again, somehow
		timestamp: Date.now(),
		temperature: sensorValue / 1000 + config.sensorTemperatureOffset
	}

	return temperatureDocument;
}

function insertIntoDatabase(temperatureReadingDocument) {
	return new Promise(function (resolve, reject) {
		db.insert(temperatureReadingDocument, function (error) {
			db.views.create("last24Hours", filterLast24Hours, sortTimestampAscending, function (error, count) {});
			db.views.create("last12Hours", filterLast12Hours, sortTimestampAscending, function (error, count) {});
			db.views.create("last6Hours", filterLast6Hours, sortTimestampAscending, function (error, count) {});
			return error ? reject(error) : resolve();
		});
	});
}

var filterLast24Hours = function(doc) {
	if (doc.timestamp >= Date.now() - 24 * 3600 * 1000) {
		return doc;
	}
};

var filterLast12Hours = function(doc) {
	if (doc.timestamp >= Date.now() - 12 * 3600 * 1000) {
		return doc;
	}
};

var filterLast6Hours = function(doc) {
	if (doc.timestamp >= Date.now() - 6 * 3600 * 1000) {
		return doc;
	}
};

var sortTimestampAscending = function(doc1, doc2) {
	return doc1.timestamp - doc2.timestamp;
}

readDir(DEVICES_PATH).then(function (fileEntries) {	
	var validFileEntries = fileEntries.filter(function (file) {
		return file.indexOf(SENSOR_DIRECTORY_MASK) == 0;
	});
	
	return Promise.all(validFileEntries.map(readFile));
}).then(function (fileContents) {
	return Promise.all(fileContents.map(parseFileContent));
}).then(function (temperatureReadings) {
	return Promise.all(temperatureReadings.map(insertIntoDatabase));
}).catch(function (error) {
	console.log("Error: ", error);
});