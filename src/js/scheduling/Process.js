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


	Process.NO_VALUE = NO_VALUE;

	global.CPUscheduling.Process = Process;

})(window);