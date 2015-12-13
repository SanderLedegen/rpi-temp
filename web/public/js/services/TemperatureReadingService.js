(function() {
	"use strict";

	var TemperatureReadingService = function($http) {

		var getAllTemperatures = function() {
			return $http.get("/api/readings");
		};

		var getTemperaturesForLastHours = function (hours) {
			return $http.get("/api/readings?lastHours=" + hours);
		};

		return {
			getAllTemperatures: getAllTemperatures,
			getTemperaturesForLastHours: getTemperaturesForLastHours
		}
	};

	angular.module("app").service("TemperatureReadingService", ["$http", TemperatureReadingService]);
})();