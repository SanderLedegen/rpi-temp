(function() {
	"use strict";

	var TemperatureReadingService = function($http) {

		var getTemperatures = function() {
			return $http.get("/api/readings");
		};

		return {
			getTemperatures: getTemperatures
		}
	};

	angular.module("app").service("TemperatureReadingService", ["$http", TemperatureReadingService]);
})();