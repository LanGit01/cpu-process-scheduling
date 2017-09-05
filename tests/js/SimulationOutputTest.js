require.config({
	baseUrl: "../src/js",
	paths: {
		"Core": "core",
		"Schedulers": "core/schedulers",
		"Utils": "utils"
	}
});

window.onload = function(){
	require([
		"Schedulers/FCFSScheduler",
		"Schedulers/SJFScheduler",
		"Schedulers/PriorityScheduler",
		"Schedulers/RRScheduler",
		"Core/Process",
		"Core/ProcessManager",
		"Core/Record",
		"js/SimulationOutputTester.js",
		"Utils/Misc"
	], function(FCFSScheduler, SJFScheduler, PriorityScheduler, RRScheduler, Process, ProcessManager, Record, SimulationOutputTester){
		var pm, processList, record, content;

		var arr =  [[0, 5, 0, 0],
					[1, 3, 0, 2],
					[2, 4, 0, 1],
					[3, 2, 12, 0],
					[4, 8, 16, 1],
					[5, 4, 18, 0],
					[6, 5, 19, 2],
					[7, 3, 35, 2],
					[8, 4, 34, 0],
					[9, 6, 39, 3],
					[10, 4, 40, 1]];

		createSection("FCFSScheduler");
		runSimulation(FCFSScheduler, arr);

		createSection("SJFScheduler (Non-Preemptive)");
		runSimulation(SJFScheduler, arr, false);

		createSection("SJFScheduler (Preemptive)");
		runSimulation(SJFScheduler, arr, true);

		createSection("PriorityScheduler (Non-Preemptive)");
		runSimulation(PriorityScheduler, arr, false);

		createSection("PriorityScheduler (Preemptive)");
		runSimulation(PriorityScheduler, arr, true);

		createSection("RRScheduler (quanta = 2)");
		runSimulation(RRScheduler, arr, 2);



		function runSimulation(Scheduler, processValues){
			var pm = new ProcessManager(),
				record = new Record(),
				container = document.body.appendChild(document.createElement("div")),
				processList;


			processValues.forEach(function(value){
				pm.addProcess(value[0], value[1], value[2], value[3]);
			});

			//var test = new (Function.bind.apply(Scheduler, Array.prototype.splice.call(arguments, 2)));
			var args = [null];
			args.push.apply(args, Array.prototype.slice.call(arguments, 2))

			//console.log(new (Scheduler.bind.apply(Scheduler, Array.prototype.splice.call(arguments, 2))));
			processList = pm.run(new (Scheduler.bind.apply(Scheduler, args)), record);
			container.appendChild(SimulationOutputTester.generateLogTable(record.getLogs()));
			container.appendChild(SimulationOutputTester.generateProcessDataTable(processList));
		}

		function createScheduler(Scheduler, args){

		}

		function createSection(title){
			var container = document.body.appendChild(document.createElement("div")),
				h2 = container.appendChild(document.createElement("h2"));

			container.style.textAlign = "center";
			h2.appendChild(document.createTextNode(title));
		}
	});
}
