/**
 *	SchedulerUnitTester is meant for Unit Testing, and is made without care about speed and optimization. 
 *	This is supposed to be just a check for correctness, nothing more.
 *
 *	To test data, you need to call `SchedulerUnitTester.test` passing 2 parameters: 
 *		param 1 - the data
 *		param 2 - the html div to output the results, if none provided, outputs to console
 *
 *	Do note that the output string does not contain html breaks (<br>), so if it the output will be in html,
 *	it is highly recommended that you wrap the <div> in <pre>
 */
define([
	"Core/ProcessManager",
	"Core/Record",
	"Schedulers/FCFSSCheduler",
	"Schedulers/RRScheduler",
	"Schedulers/PriorityScheduler",
	"Schedulers/SJFScheduler",
	"Schedulers/MLQScheduler",
	"Schedulers/MLFQScheduler"
], function(ProcessManager, Record, FCFSScheduler, RRScheduler, PriorityScheduler, SJFScheduler, MLQScheduler, MLFQScheduler){

	// ID BT AT Priority ST ET WT TT
	var ID = 0, BT = 1, AT = 2, Prio = 3, ST = 4, ET = 5, WT = 6, TT = 7, level = 8;



	function test(data){
		var outputStr = "Scheduler Unit Test\n==============================\n\n\n",
			div;

		if(data.FCFS) 	
			outputStr += testData("First Come First Served", data.FCFS, new FCFSScheduler());
		
		if(data.RR)
			outputStr += testData("Round Robin", data.RR, new RRScheduler(data.RR.quanta));
		
		if(data.PriorityNonPreemptive)
			outputStr += testData("Priority Non-Preemptive", data.PriorityNonPreemptive, new PriorityScheduler(false));

		if(data.PriorityPreemptive)
			outputStr += testData("Priority Preemptive", data.PriorityPreemptive, new PriorityScheduler(true));

		if(data.SJF)
			outputStr += testData("Shortest Job First", data.SJF, new SJFScheduler(false));

		if(data.SRTF)
			outputStr += testData("Shortest Remaining Time First", data.SRTF, new SJFScheduler(true));

		if(data.MLQ)
			outputStr += testData("Multilevel Queue Non-Preemptive", data.MLQ, new MLQScheduler(false, [
				new PriorityScheduler(true),
				new SJFScheduler(true),
				new RRScheduler(2),
				new FCFSScheduler()
			]));

		if(data.MLQPreemptive){
			outputStr += testData("Multilevel Queue Preemptive", data.MLQPreemptive, new MLQScheduler(true, [
				new PriorityScheduler(true),
				new SJFScheduler(true),
				new RRScheduler(2),
				new FCFSScheduler()
			]));
		}

		if(data.MLFQ)
			outputStr += testData("Multilevel Feedback Queue", data.MLFQ, new MLFQScheduler(false, new SJFScheduler(true), [2, 3, 4]));

		if(data.MLFQPreemptive)
			outputStr += testData("Multilevel Feedback Queue Preemptive", data.MLFQPreemptive, new MLFQScheduler(true, new SJFScheduler(true), [2, 3, 4]));

		div = document.createElement("div");
		div.appendChild(document.createTextNode(outputStr));
		return div;
	}


	function testData(title, testData, scheduler){
		return title + "\n" + ("-").repeat(title.length) + "\n" + generateTextReport(runScheduler(testData.data, scheduler), testData) + "\n\n\n";
	}


	function generateTextReport(results, correct){
		var processes = results.processes,
			logs = results.logs,
			incorrectProcesses = findIncorrectData(results.processes, correct.data),
			incorrectLogs = findIncorrectLogs(results.logs, correct.logs),
			incorrectMaps, 
			report = "";

		report = 	"Tested: " + processes.length + "\n" +
					"Correct: " + (processes.length - incorrectProcesses.length) + "\n" +
					"IDs of incorrect: [" + (incorrectProcesses.join(", ") || "none") + "]\n" +
					(" - ").repeat(8) + "\n" +
					"Num Logs: " + logs.length + "\n" +
					"Incorrect Logs List: [" + (incorrectLogs.join(", ") || "none") + "]\n";

		if(correct.map){
			incorrectMaps = findIncorrectMap(results.processLevelMap, correct.map);
			report += "Incorrect Map List: [" + (incorrectMaps.join(", ")|| "none") + "]\n";	
		}
		
		return report;
	}


	function findIncorrectData(resultProcesses, correctProcessData){
		return resultProcesses.reduce(function(accumulator, value, index){
			var correctValue = correctProcessData[index];

			if(
				value.id !== correctValue[ID] ||
				value.startTime !== correctValue[ST] ||
				value.endTime !== correctValue[ET] ||
				value.getWaitTime() !== correctValue[WT] ||
				value.getTurnaroundTime() !== correctValue[TT]
			){
				accumulator.push(value.id);
			}

			return accumulator;
		}, []);
	}


	function findIncorrectLogs(resultLogs, correctLogs){
		return resultLogs.reduce(function(accumulator, value, index){
			if(value !== correctLogs[index]){
				accumulator.push(index);
			}

			return accumulator;
		}, []);
	}


	function findIncorrectMap(resultMap, correctMap){
		return resultMap.reduce(function(accumulator, value, index){
			var i, m = correctMap[index], pair;

			for(i = 0; i < m.length; i++){
				pair = m[i];
				if(!(pair[0] in value) || value[pair[0]] !== pair[1]){
					accumulator.push(index);
					break;
				}
			}

			return accumulator;
		}, []);
	}

	function runScheduler(data, scheduler){
		var pm = new ProcessManager();

		data.forEach(function(pData){
			pm.addProcess(pData[ID], pData[BT], pData[AT], pData[Prio], pData[level]);
		});

		record = new Record();
		processes = pm.run(scheduler, record);

		return {
			processes: processes.sort(function(a, b){
				if(a.id < b.id){
					return -1;
				}else
				if(a.id > b.id){
					return 1;
				}else{
					return 0;
				}
			}),

			logs: record.getLogs().map(function(value){
				return (value.running ? value.running.id : -1);
			}),

			processLevelMap: (scheduler.getProcessLevelMap ? record.getLogs().map(function(value){
				return value.processLevelMap;
			}) : null)
		}
	}

	return {
		test: test
	};
});