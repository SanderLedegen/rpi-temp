(function() {
	"use strict";

	var HomeController = function($scope, $filter, temperatureReadingService) {
		$scope.selectData = {
			lastHours: "12",
			options: [
				{ value: "24", name: "Last 24 hours" },
				{ value: "12", name: "Last 12 hours" },
				{ value: "6", name: "Last 6 hours" }
			]
		};

		$scope.changeLastHours = function () {
			var lastHours = $scope.selectData.lastHours;
			temperatureReadingService.getTemperaturesForLastHours(lastHours).then(success, failure);
		};

		$scope.highchartsNG = {
	        options: {
	            chart: {
	                type: "line"
	            },
	            tooltip: {
	            	valueSuffix: "°C"
	            }
	        },
	        series: [],
	        title: {
	            text: "Temperature",
	            style: {
	            	"fontWeight": "bold",
	            	"fontSize": "22px"
	            }
	        },
	        subtitle: {
	            text: "Raspberry Pi sensor(s)"
	        },
	        yAxis: {
	        	title: {
	        		text: "Temperature (°C)"
	        	}
	        },
	        loading: true,
	        credits: {
	        	enabled: false
	        }
	    };

		var success = function (data) {
			var groupedTemperatures = groupBy(data.data, "sensorId");
			$scope.highchartsNG.series = [];

			angular.forEach(groupedTemperatures, function (value, key) {
				var series = {
					name: key,
					data: value.map(function (tempReading) { return tempReading.temperature })
				};
				$scope.highchartsNG.series.push(series);
			});

			$scope.highchartsNG.options.xAxis = {
				categories: data.data.map(function (tempReading) { return $filter("date")(tempReading.timestamp, "d MMM, H:mm") } )
			};
			$scope.highchartsNG.loading = false;
		};

		var failure = function (error) {
			console.log(error);
		};

		var groupBy = function (array, property) {
			return array.reduce(function(prevVal, curVal) {
				if (!prevVal[curVal[property]]) {
					prevVal[curVal[property]] = [];
				}

				prevVal[curVal[property]].push(curVal);
				return prevVal;
			}, {});
		}

		$scope.changeLastHours();
	};
	
	angular.module("app").controller("HomeController", ["$scope", "$filter", "TemperatureReadingService", HomeController]);
})();
