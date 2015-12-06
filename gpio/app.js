"use strict";

var NeDB = require("nedb-logger");
var fs = require("fs");
var config = require("../config/config");
var db = new NeDB({ filename: config.dbPath });

const DEVICES_PATH = config.devicesPath ? config.devicesPath : "/sys/bus/w1/devices/";
const SENSOR_FILE_MASK = "28-";
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
		timestamp: new Date(),
		temperature: sensorValue / 1000 + config.sensorTemperatureOffset
	}

	return temperatureDocument;
}

function insertIntoDatabase(temperatureReadingDocument) {
	return new Promise(function (resolve, reject) {
		db.insert(temperatureReadingDocument, function (error) {
			return error ? reject(error) : resolve();
		});
	});
}

readDir(DEVICES_PATH).then(function (fileEntries) {	
	var validFileEntries = fileEntries.filter(function (file) {
		return file.indexOf(SENSOR_FILE_MASK) == 0;
	});
	
	return Promise.all(validFileEntries.map(readFile));
}).then(function (fileContents) {
	return Promise.all(fileContents.map(parseFileContent));
}).then(function (temperatureReadings) {
	return Promise.all(temperatureReadings.map(insertIntoDatabase));
}).catch(function (error) {
	console.log("Error: ", error);
});