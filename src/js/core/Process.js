(function(Core){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core
	 */

	var NO_VALUE = -1;


	/**
	 *	Container object for scheduling-related data of a single process
	 */
	function Process(id, burstTime, arrivalTime, priority){
		// Initial data
		this.id = id;
		this.burstTime = burstTime;
		this.arrivalTime = arrivalTime;

		this.remainingTime = burstTime;

		this.priority = priority;

		// Log data
		this.endTime = NO_VALUE;
		this.startTime = NO_VALUE;
	}


	Process.prototype.getTurnaroundTime = function(){
		if(this.arrivalTime !== NO_VALUE && this.endTime !== NO_VALUE){
			return this.endTime - this.arrivalTime + 1;
		}

		return NO_VALUE;
	};


	Process.prototype.getResponseTime = function(){
		if(this.arrivalTime !== NO_VALUE && this.startTime !== NO_VALUE){
			return this.startTime - this.arrivalTime;
		}

		return NO_VALUE;
	};


	Process.prototype.getWaitTime = function(){
		var tt = this.getTurnaroundTime();

		if(tt !== NO_VALUE && this.burstTime !== NO_VALUE){
			return tt - this.burstTime;
		}

		return NO_VALUE;
	};


	Process.NO_VALUE = NO_VALUE;

	Core.Process = Process;

})(ProcessScheduling.Core);