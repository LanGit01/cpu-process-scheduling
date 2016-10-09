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
	 *	Implementation of the "Shortest Job First" scheduling strategy
	 */
	function SJFscheduler(preemptive){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList(compareRemainingTimes);

		this._preemptive = preemptive;

		this._logger = null;
	}


	SJFscheduler.prototype.newArrivingProcess = function(process){
		this._waitingProcesses.insert(process);
	}


	SJFscheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	SJFscheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	SJFscheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	SJFscheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses;
	}


	SJFscheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}

	/**
	 *	Consume 1 time-step of the processor, and if there is a running process, allocates the
	 *	processor resources to it. 
	 */
	SJFscheduler.prototype.step = function(){
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




	function compareRemainingTimes(p1, p2){
		var r1 = p1.remainingTime,
			r2 = p2.remainingTime;

			if(r1 > r2){
				return 1;
			}else
			if(r1 < r2){
				return -1;
			}else{
				return 0;
			}
	}



	global.CPUscheduling.SJFscheduler = SJFscheduler;


})(window);