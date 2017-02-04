(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
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


	SJFScheduler.prototype.isMultilevel = function(){
		return false;
	}


	SJFScheduler.prototype.shouldPreempt = function(){
		if(!this._preemptive){
			return false;
		}

		var running = this._runningProcess,
			firstWaiting;

		if(running && this._waitingProcesses.getLength > 0 && this._newArrival){
			firstWaiting = this._waitingProcesses.elementAt(0);
			return (compareRemainingTimes(firstWaiting, running) < 0);
		}

		return false;
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
		return this._waitingProcesses.toArray();
	}


	SJFScheduler.prototype.getProcesses = function(){
		var processes = this._waitingProcesses.toArray();;

		if(this._runningProcess){
			processes[processes.length] = this._runningProcess;
		}

		return processes;
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


		if(running !== null){
			// Check for running process termination or preemption
			if(running.remainingTime === 0){
				running = null;
			}else
			if(this._preemptive && this._newArrival){
				firstWaiting = waiting.elementAt(0);

				if(compareRemainingTimes(firstWaiting, running) < 0){
					waiting.insert(running);
					running = null;
				}
			}
		}

		// Check if a there is no running process, and if it should load one from the waiting
		if(running === null && waiting.getLength() > 0){
			running = waiting.removeHead();
		}

		if(running !== null){
			running.remainingTime--;
		}

		this._runningProcess = running;
		this._newArrival = false;
	}


	/*			Auxillary functions			*/
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


})(this);