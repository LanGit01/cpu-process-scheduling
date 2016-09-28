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
	 *	Implementation of the "First Come, First Served" scheduling strategy
	 */
	function FCFSscheduler(){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList();

		this._logger = null;
	}


	FCFSscheduler.prototype.newArrivingProcess = function(process){
		this._waitingProcesses.insert(process);
	}


	FCFSscheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	FCFSscheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	FCFSscheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	FCFSscheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses;
	}


	FCFSscheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}

	/**
	 *	Consume 1 time-step of the processor, and if there is a running process, allocates the
	 *	processor resources to it. 
	 */
	FCFSscheduler.prototype.step = function(){
		var running = this._runningProcess,
			waiting = this._waitingProcesses;

		if(running !== null){
			running.remainingTime--;
		}

		if(running === null || running.remainingTime === 0){
			if(waiting.getLength() > 0){
				this._runningProcess = waiting.removeHead();
			}else{
				this._runningProcess = null;
			}
		}
	}



	global.CPUscheduling.FCFSscheduler = FCFSscheduler;


})(window);