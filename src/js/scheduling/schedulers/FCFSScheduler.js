(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var LinkedList = global.CPUscheduling.LinkedList;


	/**
	 *	Implementation of the "First Come, First Served" scheduling strategy
	 */
	function FCFSScheduler(){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList();

		this._logger = null;
	}


	FCFSScheduler.prototype.newArrivingProcess = function(process){
		if(this._runningProcess === null){
			this._runningProcess = process;
		}else{
			this._waitingProcesses.insert(process);
		}
	}


	FCFSScheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	FCFSScheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	FCFSScheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	FCFSScheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses;
	}


	FCFSScheduler.prototype.getProcesses = function(){
		var processes = this._waitingProcesses.toArray();;

		if(this._runningProcess){
			processes[processes.length] = this._runningProcess;
		}

		return processes;
	}


	FCFSScheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}

	/**
	 *	Consume 1 time-step of the processor, and if there is a running process, allocates the
	 *	processor resources to it. 
	 */
	FCFSScheduler.prototype.step = function(){
		var running = this._runningProcess,
			waiting = this._waitingProcesses;

		if(running === null || running.remainingTime === 0){
			if(waiting.getLength() > 0){
				this._runningProcess = waiting.removeHead();
			}else{
				this._runningProcess = null;
			}

			running = this._runningProcess;
		}

		if(running !== null){
			running.remainingTime--;
		}
	}



	global.CPUscheduling.FCFSScheduler = FCFSScheduler;


})(this);