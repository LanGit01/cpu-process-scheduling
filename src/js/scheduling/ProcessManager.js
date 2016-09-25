(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	// Check dependencies
	if(!global.CPUscheduler.Process){
		console.log("CPUscheduler.Process is not defined");
		return;
	}



	/**
	 *	A simulator for the processes inside a machine
	 *
	 *	Time is incremented in discrete steps until all of the processes has been completed.
	 *	Processes arrives as specified, and needs to use N steps of the processor's time to complete. 
	 */
	function ProcessManager(){
		this._processes = {};
		this._scheduler = null;	

		this._idcount = 0;
	}


	ProcessManager.prototype.addProcess = function(id, burstTime, arrivalTime){
		// Probably perform type checking in the future
	
		var processes = this._processes;

		if(!processes[id]){
			processes[id] = new Process(id, burstTime, arrivalTime);
			return true;
		}

		return false;
	}


	ProcessManager.prototype.removeProcess = function(id){
		var toRemove = this._processes[id];
		
	}


	// Note to self: getters and setters are good if you want abstraction,
	// and allows the underlying implementation to be changed without changing
	// the interface. Don't be afraid to use them if needed!
	ProcessManager.prototype.setScheduler = function(scheduler){

	}


	ProcessManager.prototype.getScheduler = function(){

	}

})(window);