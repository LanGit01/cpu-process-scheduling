(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var LinkedList = global.CPUscheduling.LinkedList;


	/**
	 *	Implementation of the "Round Robin" scheduling strategy
	 */
	function RRScheduler(quanta){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList();

		this._logger = null;

		this._quanta = quanta;
		this._quantumCount = 0;
	}


	RRScheduler.prototype.newArrivingProcess = function(process){
		if(this._runningProcess === null){
			this._runningProcess = process;
			this._quantumCount = this._quanta;
		}else{
			this._waitingProcesses.insert(process);
		}
	}

	RRScheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	RRScheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	RRScheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	RRScheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses;
	}


	RRScheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}


	RRScheduler.prototype.step = function(){
		var running = this._runningProcess,
			waiting = this._waitingProcesses;

		// Check for preemption
		if(this._quantumCount === 0 && running !== null && running.remainingTime > 0){
			waiting.insert(running);
			running = null;
		}

		if(running === null || running.remainingTime === 0){
			// If no processes are running, load one
			if(waiting.getLength() > 0){
				running = waiting.removeHead();
				this._quantumCount = this._quanta;
			}else{
				running = null;
			}
		}


		if(running !== null){
			running.remainingTime--;
			this._quantumCount--;
		}

		this._runningProcess = running;
	}


	global.CPUscheduling.RRScheduler = RRScheduler;

})(this);