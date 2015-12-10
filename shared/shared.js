"use strict";

// Config loader with defaults
var defaults = {
	dbPath: "./rpi-temp-gpio.db",
	devicesPath: "/sys/bus/w1/devices/",
	port: 8000,
	sensorTemperatureOffset: 0
};
var options = {};
try {
	options = require("../config/config");
} catch (err) {
	console.log(err);
	console.log("Could not load 'config/config.js', falling back to default configuration. Did you create a configuration file?")
}

function extend(defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

// Exports
module.exports = {
	config: extend(defaults, options)
}