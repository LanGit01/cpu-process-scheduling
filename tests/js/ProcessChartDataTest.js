require.config({
	baseUrl: "../src/js",
	paths: {
		"Core": "core",
		"Schedulers": "core/schedulers",
		"Gui": "gui",
		"Utils": "utils"
	}
});


window.onload = function(){
	require([
		"Core/Process",
		"Core/Record",
		"Core/ProcessManager",
		"Schedulers/FCFSScheduler",
		"Schedulers/SJFScheduler",
		"Schedulers/PriorityScheduler", 
		"Schedulers/RRScheduler",
		"Schedulers/MLQScheduler",
		"Gui/ProcessChartData",
		"Utils/misc"
	], function(Process, Record, ProcessManager, FCFSScheduler, SJFScheduler, PriorityScheduler, RRScheduler, MLQScheduler, ProcessChartData){
		var data = [
				[0, 4, 0, 0, 4, 7, 4, 8, 1],
				[1, 4, 0, 0, 8, 11, 8, 12, 2],
				[2, 4, 0, 0, 0, 3, 0, 4, 0],
				[3, 2, 13, 0, 13, 17, 3, 5, 1],
				[4, 3, 14, 0, 14, 16, 0, 3, 0],
				[5, 6, 18, 0, 18, 29, 6, 12, 2],
				[6, 3, 19, 0, 19, 21, 0, 3, 1],
				[7, 3, 24, 0, 24, 26, 0, 3, 0]
			];

		var pm = new ProcessManager(),
			record = new Record();

		var processes = data.forEach(function(d){
			pm.addProcess(d[0], d[1], d[2], d[3], d[8]);
		});

		
		
		pm.run(new MLQScheduler(false, [
				new PriorityScheduler(true),
				new SJFScheduler(true),
				new RRScheduler(2),
				new FCFSScheduler()
			]), record);

		var logs = record.getLogs();
		printLogs(logs);

		var level = 2,
			pcd = new ProcessChartData(logs, level);


		for(var i = 0; i < 29; i++){
			printComparison(logs, pcd, i, level);
		}
	});

	function printComparison(logs, pcd, time, level){
		var running = pcd.getRunning(time),
			waiting = pcd.getWaiting(time).map(function(p){
				return p.id;
			});

		var text = "[" + time + "] Level = " + level
					+ "\n---------------" 
					+ "\nRunning: " + (running ? running.id : "none") + "\nWaiting: " + waiting.join(", ") + "\n"
					+ "Map: ";

		console.log(text);
		console.log(logs[time].processLevelMap);
	}

	function printLogs(logs){
		logs.forEach(function(log, i){
			var waiting = log.waiting.map(function(v){ return v.id; });
			var text = "[" + i + "] Running: " + (log.running ? log.running.id : "none") + "\n"
						+ "    Waiting: (" + waiting.join(", ") + ")\n\n"; 
			
			//console.log(text);

			document.getElementById("record").appendChild(document.createTextNode(text));
		});
	}
};