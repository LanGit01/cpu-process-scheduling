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

	var Process = global.CPUscheduling.Process,
		LinkedList = global.CPUscheduling.LinkedList;



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


	ProcessManager.prototype.run = function(){
		var processesItr = this._processes.getIterator(),
			time = 0, 
			nextProcess = null, latestProcess = null,
			running;

		
		while(running){
			if(time === nextProcess.arrivalTime){
				// add process to scheuler
				nextProcess = (processItr.hasNext() ? processItr.getNext() : null);
			}

			// scheduler step

			// check if still running
			if(!processItr.hasNext() && true){
				running = false;
			}else{
				time++;
			}
		}
		/*
			Pseudocode:
				
				Until all processes are completed
					if(new process arrived)
						add process to scheduler
					
					step
					time++
				end

			Processes are completed if:
				1. no more arriving processes left
				2. no more running processes
		*/
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