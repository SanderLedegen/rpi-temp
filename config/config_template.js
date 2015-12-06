module.exports = {

	// Path to the file that will hold the database. Will be created automatically if it doesn't exist and can have any extension.
	dbPath: "path/to/database/file",
	
	// (Optionally) Raspberry Pi lists all its one-wire devices under /sys/bus/w1/devices/. Specify an override if necessary.
	devicesPath: "path/to/w1/devices",

	// Port used for the web server
	port: 8000,

	// Apply an offset to the temperature read by the sensor.
	// Eg. when the real temperature is 22.41°C but the sensor reads 23.65°C, the offset would be -1.24.
	sensorTemperatureOffset: 0
}