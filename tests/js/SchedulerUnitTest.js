require.config({
	baseUrl: "../src/js",
	paths: {
		"Core": "core",
		"Schedulers": "core/schedulers",
		"Utils": "utils"
	}
});

window.onload = function(){
	require(["js/SchedulerUnitTester.js", "js/TestData1.js", "js/TestData2.js", "Utils/Misc"], function(SchedulerUnitTester, TestData1, TestData2){
		printResults("test-results-1", TestData1);
		printResults("test-results-2", TestData2);

		function printResults(id, data){
			var container = document.getElementById(id);
			container.appendChild(SchedulerUnitTester.test(data));
		}
	});
}		