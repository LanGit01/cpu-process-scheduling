var SchedulerUnitTester = (function(Core, Schedulers){
	var ProcessManager = Core.ProcessManager,
		Record = Core.Record,
		FCFSScheduler = Schedulers.FCFSScheduler,
		RRScheduler = Schedulers.RRScheduler,
		PriorityScheduler = Schedulers.PriorityScheduler,
		SJFScheduler = Schedulers.SJFScheduler,
		MLQScheduler = Schedulers.MLQScheduler,
		MLFQScheduler = Schedulers.MLFQScheduler;

	// ID BT AT Priority ST ET WT TT
	var ID = 0, BT = 1, AT = 2, Prio = 3, ST = 4, ET = 5, WT = 6, TT = 7, level = 8;

	function test(data, htmlDiv){
		var outputStr = "Scheduler Unit Test\n==============================\n\n\n";

		if(data.FCFS){
			outputStr += "FCFS\n-----\n" + 
					  generateTextReport(runScheduler(data.FCFS.data, new FCFSScheduler()), data.FCFS) + "\n\n\n";
		}

		if(data.RR){
			outputStr += "RR\n-----\n" + 
					  generateTextReport(runScheduler(data.RR.data, new RRScheduler(data.RR.quanta)), data.RR) + "\n\n\n";				
		}

		if(data.PriorityNonPreemptive){
			outputStr += "Priority Non Preemptive\n-----------------------\n" + 
					  generateTextReport(runScheduler(data.PriorityNonPreemptive.data, new PriorityScheduler(false)), data.PriorityNonPreemptive) + "\n\n\n";							
		}

		if(data.PriorityPreemptive){
			outputStr += "Priority Preemptive\n--------------------\n" + 
					  generateTextReport(runScheduler(data.PriorityPreemptive.data, new PriorityScheduler(true)), data.PriorityPreemptive) + "\n\n\n";							
		}

		if(data.SJF){
			outputStr += "SJF\n-----\n" + 
					  generateTextReport(runScheduler(data.SJF.data, new SJFScheduler(false)), data.SJF) + "\n\n\n";
		}

		if(data.SRTF){
			outputStr += "SRTF\n-----\n" + 
					  generateTextReport(runScheduler(data.SRTF.data, new SJFScheduler(true)), data.SRTF) + "\n\n\n";
		}

		if(data.MLQ){
			outputStr += "MLQ Non-Preemptive\n------------------\n" +
					  	generateTextReport(runScheduler(data.MLQ.data, 
					  		new MLQScheduler(false, [
					  			new PriorityScheduler(true),
					  			new SJFScheduler(true),
					  			new RRScheduler(2),
					  			new FCFSScheduler()
					  		])), 
					  	data.MLQ, true) + "\n\n\n";
		}

		if(data.MLQPreemptive){
			outputStr += "MLQ Preemptive\n--------------\n" +
					  	generateTextReport(runScheduler(data.MLQPreemptive.data, 
					  		new MLQScheduler(true, [
					  			new PriorityScheduler(true),
					  			new SJFScheduler(true),
					  			new RRScheduler(2),
					  			new FCFSScheduler()
					  		])), 
					  	data.MLQPreemptive, true) + "\n\n\n";
		}

		if(data.MLFQ){
			outputStr += "MLFQ\n------\n" +
						generateTextReport(runScheduler(data.MLFQ.data, 
								new MLFQScheduler(false, new SJFScheduler(true), [2, 3, 4])
							),
						data.MLFQ, true) + "\n\n\n";
		}

		if(data.MLFQPreemptive){
			outputStr += "MLFQ Preemptive\n--------------\n" +
						generateTextReport(runScheduler(data.MLFQPreemptive.data,
								new MLFQScheduler(true, new SJFScheduler(true), [2, 3, 4])
							),
						data.MLFQPreemptive, true) + "\n\n\n";
		}


		if(htmlDiv){
			htmlDiv.appendChild(document.createTextNode(outputStr));
		}else{
			console.log(outputStr);
		}
	}


	function generateTextReport(results, correct, multilevel){
		var processes = results.processes,
			logs = results.logs,
			incorrectProcesses = findIncorrectData(results.processes, correct.data),
			incorrectLogs = findIncorrectLogs(results.logs, correct.logs),
			incorrectMaps, report;

		report = "Tested: " + processes.length + "\nCorrect: " + (processes.length - incorrectProcesses.length) +
				 "\nIncorrect: " + incorrectProcesses.length +
				 "\nIDs of Incorrect: [" + (incorrectProcesses.join(", ") || "none") + "]";

		report += "\n-  -  -  -  -  -  -  -  -\n";

		report += "Num Logs: " + logs.length + 
				  "\nIncorrect Logs List: [" + (incorrectLogs.join(", ") || "none") + "]";

		if(multilevel){
			incorrectMaps = findIncorrectMap(results.processLevelMap, correct.map);
			report += "\nIncorrect Map List: [" + (incorrectMaps.join(", ")|| "none") + "]";	
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
		var pm = new ProcessManager(),
			i, pData, record, processes, recordLogs;

		for(i = 0; i < data.length; i++){
			pData = data[i];
			pm.addProcess(pData[ID], pData[BT], pData[AT], pData[Prio], pData[level]);
		}

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
	}

})(ProcessScheduling.Core, ProcessScheduling.Core.Schedulers);