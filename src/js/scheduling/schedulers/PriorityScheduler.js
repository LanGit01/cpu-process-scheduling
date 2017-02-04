(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var LinkedList = global.CPUscheduling.LinkedList;


	/**
	 *	Implementation of the "Priority" scheduling strategy
	 *
	 *	The priority goes higher as the priority number goes higher, i.e. 2 has more priority than 1
	 */
	function PriorityScheduler(preemptive){
		this._runningProcess = null;
		this._waitingProcesses = new LinkedList(function(a, b){
			return comparePriority(a, b) * -1;
		});

		this._logger = null;

		this._preemptive = preemptive;
		this._newArrival = false;
	}


	PriorityScheduler.prototype.newArrivingProcess = function(process){
		this._waitingProcesses.insert(process);
		this._newArrival = true;
	}


	PriorityScheduler.prototype.isMultilevel = function(){
		return false;
	}


	PriorityScheduler.prototype.shouldPreempt = function(){
		if(!this._preemptive){
			return false;
		}

		var running = this._runningProcess,
			firstWaiting;

		if(running && this._waitingProcesses.getLength() > 0 && this._newArrival){
			firstWaiting = this._waitingProcesses.elementAt(0);
			return (comparePriority(firstWaiting, running) > 0);
		}

		return false;
	}


	PriorityScheduler.prototype.hasRunningProcess = function(){
		return (this._runningProcess !== null);
	}


	PriorityScheduler.prototype.getRunningProcess = function(){
		return this._runningProcess;
	}


	PriorityScheduler.prototype.hasWaitingProcesses = function(){
		return (this._waitingProcesses.getLength() > 0);
	}


	PriorityScheduler.prototype.getWaitingProcesses = function(){
		return this._waitingProcesses.toArray();
	}


	PriorityScheduler.prototype.getProcesses = function(){
		var processes = this._waitingProcesses.toArray();

		if(this._runningProcess){
			processes[processes.length] = this._runningProcess;
		}

		return processes;
	}


	PriorityScheduler.prototype.setLogger = function(logger){
		this._logger = logger;
	}

	/**
	 *	Consume 1 time-step of the processor, and if there is a running process, allocates the
	 *	processor resources to it. 
	 */
	PriorityScheduler.prototype.step = function(){
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

				if(comparePriority(firstWaiting, running) > 0){
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


	/*			Auxillary functions			*/
	function comparePriority(p1, p2){
		var pr1 = p1.priority,
			pr2 = p2.priority;

		if(pr1 > pr2){
			return 1;
		}else
		if(pr1 < pr2){
			return -1;
		}else{
			return 0;
		}
	}


	global.CPUscheduling.PriorityScheduler = PriorityScheduler;


})(this);