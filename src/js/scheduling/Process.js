(function(global){

	if(!global.CPUscheduling){
		global.CPUscheduling = {};
	}

	var NO_VALUE = -1;


	/**
	 *	Container object for scheduling-related data of a single process
	 *
	 *	Holds the two data categories:
	 *		initial data - 
	 *		log data - data collected after the process is ran and completed
	 */
	function Process(id, burstTime, arrivalTime, priority){
		// Initial data
		this.id = id;
		this.burstTime = burstTime;
		this.arrivalTime = arrivalTime;

		this.remainingTime = burstTime;

		// Log data
		this.endTime = NO_VALUE;
		this.waitTime = NO_VALUE;
		this.startTime = NO_VALUE;
		this.responseTime = NO_VALUE;

		this.priority = priority;
	}


	Process.prototype.getTurnaroundTime = function(){
		if(this.arrivalTime !== NO_VALUE && this.endTime !== NO_VALUE){
			return this.endTime - this.arrivalTime + 1;
		}

		return NO_VALUE;
	}


	Process.prototype.getResponseTime = function(){
		if(this.arrivalTime !== NO_VALUE && this.startTime !== NO_VALUE){
			return this.startTime - this.arrivalTime;
		}

		return NO_VALUE;
	}


	Process.prototype.getWaitTime = function(){
		var tt = this.getTurnaroundTime();

		if(tt !== NO_VALUE && this.burstTime !== NO_VALUE){
			return tt - this.burstTime;
		}

		return NO_VALUE;
	}


	Process.NO_VALUE = NO_VALUE;

	global.CPUscheduling.Process = Process;

})(window);