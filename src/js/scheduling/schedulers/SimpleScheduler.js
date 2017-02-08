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
		return (this._lastRunning && this._lastRunning.remainingTime === 0);
	}


	SimpleScheduler.prototype.isStartingProcess = function(){
		// applicable only at State 2 (Running State)
		return (this._lastRunning && this._lastRunning.burstTime === (this._lastRunning.remainingTime + 1));
	}


	SimpleScheduler.prototype.hasPreempted = function(){
		// Applicable only at State 1 (Ready State)
		return (this._lastRunning && this._lastRunning.remainingTime > 0 && this._lastRunning !== this._running);
	}


	SimpleScheduler.prototype.getProcesses = function(){}

	Schedulers.SimpleScheduler = SimpleScheduler;

})(ProcessScheduling.Core.Schedulers);