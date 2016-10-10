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
	function SJFScheduler(preemptive){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList(compareRemainingTimes);

		this._preemptive = preemptive;
		this._newArrival = false;

		this._logger = null;
	}


	SJFScheduler.prototype.newArrivingProcess = function(process){
		this._waitingProcesses.insert(process);
		this._newArrival = true;
	}


	SJFScheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	SJFScheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	SJFScheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	SJFScheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses;
	}


	SJFScheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}

	/**
	 *	Consume 1 time-step of the processor, and if there is a running process, allocates the
	 *	processor resources to it. 
	 */
	SJFScheduler.prototype.step = function(){
		var running = this._runningProcess,
			waiting = this._waitingProcesses,
			firstWaiting;

		// Check if a process terminates
		if(running !== null && running.remainingTime === 0){
			running = null;
		}

		if(waiting.getLength() > 0){
			if(running === null){
				// if no processes are running, load one
				running = waiting.removeHead();
			}else
			if(this._preemptive && this._newArrival){
				// if should preempt
				firstWaiting = waiting.elementAt(0);

				if(compareRemainingTimes(firstWaiting, running) < 0){
					firstWaiting = waiting.removeHead();
					waiting.insert(running);
					running = firstWaiting;
				}
			}
		}

		if(running !== null){
			running.remainingTime--;
		}

		this._runningProcess = running;
		this._newArrival = false;
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



	global.CPUscheduling.SJFScheduler = SJFScheduler;


})(window);