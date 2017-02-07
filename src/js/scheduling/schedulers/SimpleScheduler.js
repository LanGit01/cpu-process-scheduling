(function(Schedulers){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.SimpleSchedulers
	 */


	/**
	 *	Base (interface)class for the simple schedulers: FCFS, SJF, Priority, and Round Robin
	 *
	 *		
	 *
	 */
	function SimpleScheduler(){}


	SimpleScheduler.prototype.hasRunning = function(){
		return (this._running !== null);
	}


	SimpleScheduler.prototype.hasWaiting = function(){
		return (this._waiting.getLength() > 0);
	}

	SimpleScheduler.prototype.getRunning = function(){
		return this._running;
	}

	SimpleScheduler.prototype.getWaiting = function(){
		return this._waiting.toArray();
	}

	SimpleScheduler.prototype.runningTerminated = function(){

	}

	SimpleScheduler.prototype.getProcesses = function(){}

	Schedulers.SimpleScheduler = SimpleScheduler;

})(ProcessScheduling.Core.Schedulers);