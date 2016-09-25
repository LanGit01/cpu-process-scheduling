(function(global){

	// Check namespace
	if(typeof global.CPUscheduler !== "object" || global.CPUscheduler === null){
		console.log("CPUscheduler is not defined. Module unable to load.");
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
		this._processes = [];
		this._scheduler = null;	

		this._idcount = 0;
	}


	ProcessManager.prototype.addProcess = function(burstTime, arrivalTime){
		// Probably perform type checking in the future
		
	}


	ProcessManager.prototype.removeProcess = function(id){

	}


	// Note to self: getters and setters are good if you want abstraction,
	// and allows the underlying implementation to be changed without changing
	// the interface. Don't be afraid to use them if needed!
	ProcessManager.prototype.setScheduler = function(scheduler){

	}


	ProcessManager.prototype.getScheduler = function(){

	}

})(window);