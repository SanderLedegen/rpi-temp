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

		$scope.changeLastHours();
	};
	
	angular.module("app").controller("HomeController", ["$scope", "$filter", "TemperatureReadingService", HomeController]);
})();
