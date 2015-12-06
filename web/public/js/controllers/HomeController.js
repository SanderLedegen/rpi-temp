(function() {
	"use strict";

	var HomeController = function($scope, $filter, temperatureReadingService) {

		$scope.labels = [];
		$scope.data = [];
		$scope.options = {
			tooltipTemplate: "<%= value %>°C",
			responsive: true,
			tooltipFillColor: "rgba(0,0,0,0.5)",
			tooltipFontFamily: "Tahoma, Geneva, sans-serif",
			scaleFontFamily: "Tahoma, Geneva, sans-serif",
			scaleIntegersOnly: false
		};

		var success = function (data) {
			$scope.labels = data.data.map(function (tempReading) { return $filter("date")(tempReading.timestamp, "d MMM, H:mm") });
			$scope.data = [data.data.map(function (tempReading) { return tempReading.temperature })];
		};

		var failure = function (error) {
			console.log(error);
		};

		temperatureReadingService.getTemperatures().then(success, failure);		
	};
	
	angular.module("app").controller("HomeController", ["$scope", "$filter", "TemperatureReadingService", HomeController]);
})();
