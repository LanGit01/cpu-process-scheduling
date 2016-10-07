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
	 *	Implementation of the "Round Robin" scheduling strategy
	 */
	function RRscheduler(quanta){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList();

		this._logger = null;

		this._quanta = quanta;
		this._quantumCount = 0;
	}


	RRscheduler.prototype.newArrivingProcess = function(process){
		if(this._runningProcess === null){
			this._runningProcess = process;
			this._quantumCount = this._quanta;
		}else{
			this._waitingProcesses.insert(process);
		}
	}

	RRscheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	RRscheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	RRscheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	RRscheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses;
	}


	RRscheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}


	RRscheduler.prototype.step = function(){
		var running = this._runningProcess,
			waiting = this._waitingProcesses;


		if(this._quantumCount === 0 && running !== null && running.remainingTime > 0){
			waiting.insert(running);
			running = null;
		}

		if(running === null || running.remainingTime === 0){
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


	global.CPUscheduling.RRscheduler = RRscheduler;

})(this);