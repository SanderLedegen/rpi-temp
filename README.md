# rpi-temp
## Description
A tiny Raspberry Pi-powered temperature-logging web app. The app reads the temperature values from the hardware sensors that are connected to the Pi and displays their values in a nice-looking and interactive chart.

On a more technical note, the project has been set up using the [MEAN](http://mean.io/ "MongoDB, Express.js, Angular.js, and Node.js") stack. Well, except for the _M_ part, that is. As MongoDB is a bit overkill for this simple project, another NoSQL-database was used. On the front end, [Highcharts](http://www.highcharts.com/ "Highcharts") (and its Angular [directive](https://github.com/pablojim/highcharts-ng "highcharts-ng")) take care of displaying the data in a human-friendly and visually appealing manner.

### Screenshot
![rpi-temp screenshot](https://raw.githubusercontent.com/SanderLedegen/rpi-temp/master/rpi-temp-screenshot.png)

## Requirements
Not much of a surprise, but these are certainly things you'll need:
* Raspberry Pi model A(+)/B(+)/2 with Node.js, npm and git installed.
* At least one [DS18B20](https://www.adafruit.com/products/374) hardware sensor. Both the waterproof and _normal_ variant will do.

## Installation
The installation is quite straightforward: you pull the source and download the dependencies using node's package manager: npm.

To do the former, issue the command below on your Pi in a location of your preference:
```sh
git pull https://github.com/SanderLedegen/rpi-temp.git
```

Installing the dependencies can then be completed by running following command in both the **gpio** and **web** folder:
```sh
npm install
```

## Configuration
In the `config` folder you can find a template of the different options you can configure. It is advised to make a copy of this template and edit the values you want to change. You can copy the template with this command:

```sh
cp config_template.js config.js
```

Inside the config file, the options mentioned below are available. I added some comments above every option and because the options are pretty straightforward by themselves, I won't go further in detail. One thing to mention, though, is that your sensor(s) will be automatically picked up. You can - and in my opinion, should - give your sensors a name. You can do so using the `sensorMapping` option.

```javascript
// Path to the file that will hold the database. Will be created automatically if it doesn't exist and can have any extension.
dbPath: "path/to/database/file",

// Raspberry Pi lists all its one-wire devices under /sys/bus/w1/devices/. Only specify when an override is necessary.
devicesPath: "path/to/w1/devices",

// Port used for the web server
port: 8000,

// Apply an offset to the temperature read by the sensor.
// Eg. when the real temperature is 22.41°C but the sensor reads 23.65°C, the offset would be -1.24.
sensorTemperatureOffset: 0,

// Each sensor has a unique ID and is by default displayed as such on the chart. Using this option, you can map
// the sensor ID to something more convenient such as 'Living room', 'Outside' etc. This name will then
// be visible on the chart instead of a boring and meaningless ID.
sensorMapping: [{
	id: "28-00001337",
	name: "Living room"
}, {
	id: "28-00001338",
	name: "Outside"
}]
```

## Usage
The project is divided into two parts: **GPIO** and **web**. The GPIO part reads the sensor, parses the value and stores it into the database. The web part does exactly what you think it does: serving the necessary files to view and load the data, making use of the exact same database, of course.

### GPIO
Each time you run `node app.js` in the GPIO folder, a temperature reading will be done and its result will be stored into the database. It's as simple as that. Of course, the intention of this approach is that you use this command in a cronjob or similar to run on pre-defined intervals to create a consistent data set.

### Web
As with the GPIO subproject, run `node app.js` in the web folder and after a few seconds, the web server will be happy to handle your requests at [http://localhost:8000](http://localhost:8000). If you configured another port in `config.js`, then it's not port 8000, obviously.

## Optional

### Cronjob setup
In order to perform a temperature reading on regular intervals, you can make use of a cronjob. Open the crontab editor with following command:

```sh
crontab -e
```

There, add a new line in the typical [cronjob format](https://www.raspberrypi.org/documentation/linux/usage/cron.md). I've set it up as follows and does a reading every 20 minutes:
```
0/20 * * * * /usr/local/bin/node /home/pi/development/nodejs/rpi-temp/gpio/app.js
```

### Preserve your SD card, use tmpfs
Writing a lot to your Pi's SD card can cause it to degrade rapidly. Especially when you do a write every _x_ minutes. After a few weeks or months, those writes begin to count up and that's why I decided to create a RAM disk to store my database file on and protect my beloved SD card. Moreover, this is completely transparent for processes accessing files that are located on a RAM disk, so why not? The only drawback is that on a reboot or power loss, you lose your database, but that's something I can live with. Creating such file system can be done by opening the Pi's file system table like this...
```sh
nano /etc/fstab
```

...and appending a line similar to this one:
```sh
tmpfs    /opt/rpi-temp    tmpfs    defaults,noatime    0    0
```