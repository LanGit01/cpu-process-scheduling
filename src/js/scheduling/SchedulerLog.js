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



	/**
	 *	Keeps track of what's happening at each time-step:
	 *		- Which process is using the processor's time
	 *		- Which processes are waiting for their turn
	 *
	 *	The state of the simulation in each time-step is recorded in a log object
	 *
	 *		LogObject = {
	 *						running,
	 *						waiting
	 *					}
	 *	
	 *	Where running is a `ProcessLog` object, and waiting is an array of `ProcessLog` objects. The `ProcessLog` object
	 *	stores the relevant data of a process in the current state. The data structure for
	 *	`ProcessLog` is:
	 *
	 *		ProcessLog = {
	 *						id,
	 *						remainingTime
	 *					 }
	 *
	 *	`id` - process id
	 *	`remainingTime` - the remaining time needed to complete the process
	 */
	function SchedulerLog(){
		this._logs = new LinkedList();
	}


	/**
	 * Create a log(state record) of the state
	 */
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

	/**
	 *	Return a `LinkedList` of logs. The logs are ordered from first added to last added
	 */
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