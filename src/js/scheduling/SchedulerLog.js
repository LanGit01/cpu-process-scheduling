(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	if(!global.CPUscheduling.LinkedList){
		console.log("CPUscheduling.LinkedList is not defined");
		return;
	}


	var LinkedList = global.CPUscheduling.LinkedList;



	function SchedulerLog(){
		this._logs = new LinkedList();
	}


	SchedulerLog.prototype.log = function(runningProcess, waitingProcesses){
		var running, 
			itr = waitingProcesses.getIterator(),
			waiting = [];

		running = createProcessLogData(runningProcess);

		while(itr.hasNext()){
			waiting[waiting.length] = createProcessLogData(itr.getNext());
		}

		this._logs.insert({
			running: running,
			waiting: waiting
		});
	}


	SchedulerLog.prototype.getLogs = function(){
		return this._logs;
	}


	/*		Helper functions		*/
	function createProcessLogData(process){
		if(!process){
			return null;
		}

		return {
			id: process.id,
			remainingTime: process.remainingTime
		};
	}


	global.CPUscheduling.SchedulerLog = SchedulerLog;


})(this);