(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	// Check dependencies
	if(!global.CPUscheduling.Process){
		console.log("CPUscheduling.Process is not defined");
		return;
	}

	if(!global.CPUscheduling.LinkedList){
		console.log("CPUscheduling.LinkedList is not defined");
		return;
	}

	if(!global.CPUscheduling.SchedulerLog){
		console.log("CPUscheduling.SchedulerLog is not defined");
		return;
	}


	var Process = global.CPUscheduling.Process,
		LinkedList = global.CPUscheduling.LinkedList,
		SchedulerLog = global.CPUscheduling.SchedulerLog;



	/**
	 *	A simulator for the processes inside a machine
	 *
	 *	Time is incremented in discrete steps until all of the processes has been completed.
	 *	Processes arrives as specified, and needs to use N steps of the processor's time to complete. 
	 */
	function ProcessManager(){
		// compareArrivalTime ensures list is sorted in ascending arrival time
		this._processes = new LinkedList(compareArrivalTime, getProcessID);
		this._scheduler = null;
		this._logger = new SchedulerLog();
	}


	ProcessManager.prototype.addProcess = function(id, burstTime, arrivalTime, priority){
		// Add  argument validation later
		priority = priority || Process.NO_VALUE;
		this._processes.insert(new Process(id, burstTime, arrivalTime, priority));
	}


	ProcessManager.prototype.removeProcess = function(id){
		return this._processes.remove(id);
	}


	// Note to self: getters and setters are good if you want abstraction,
	// and allows the underlying implementation to be changed without changing
	// the interface. Don't be afraid to use them if needed!
	ProcessManager.prototype.setScheduler = function(scheduler){
		this._scheduler = scheduler;
	}


	ProcessManager.prototype.getScheduler = function(){
		return this._scheduler;
	}


	ProcessManager.prototype.getProcesses = function(){
		var processList = [],
			itr = this._processes.getIterator();

		while(itr.hasNext()){
			processList[processList.length] = itr.getNext();
		}

		return this._processes;
	}


	ProcessManager.prototype.run = function(){
		var processItr = this._processes.getIterator(),
			time = 0, 
			running, nextArrivalTime,
			nextProcess = null, arrivedProcess = null;

		
		if(!processItr.hasNext()){
			return;
		}	

		running = true;
		nextArrivalTime = processItr.peekNext().arrivalTime;

		while(running){
			if(processItr.hasNext() && time === nextArrivalTime){
				// add process to scheduler
				do{
					this._scheduler.newArrivingProcess(processItr.getNext());
				}while(processItr.hasNext() && processItr.peekNext().arrivalTime === time);

				if(processItr.hasNext()){
					nextArrivalTime = processItr.peekNext().arrivalTime;
				}
			}

			// scheduler step
			this._scheduler.step();

			// check if still running
			if(!processItr.hasNext() && !this._scheduler.hasRunningProcess()){
				running = false;
			}else{
				this._logger.log(this._scheduler.getRunningProcess(), this._scheduler.getWaitingProcesses());
				time++;
			}
		}


		return this._logger.getLogs();
	}




	/*		Auxillary functions		*/
	function compareArrivalTime(p1, p2){
		var at1 = p1.arrivalTime,
			at2 = p2.arrivalTime;

		if(at1 > at2){
			return 1;
		}else
		if(at2 < at1){
			return -1;
		}else{
			return 0;
		}
	}


	function getProcessID(process){
		return process.id;
	}

	global.CPUscheduling.ProcessManager = ProcessManager;

})(window);