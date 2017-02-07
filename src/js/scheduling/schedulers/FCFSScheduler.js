(function(Schedulers, Utils){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Utils	
	 */

	var LinkedList = Utils.LinkedList,
		SimpleScheduler = Schedulers.SimpleScheduler;

	/**
	 *	Scheduler using the First Come First Served scheduling algorithm
	 */
	function FCFSScheduler(){
		this._running = null;
		this._waiting = new LinkedList();
		this._lastRunning = null;

	}


	FCFSScheduler.subclass(SimpleScheduler);

	/**
	 *	Signifies the start of the timestep cycle.
	 *
	 *	Prepares the scheduler for the next cycle. This method must be called to start the next timestep. 
	 */
	FCFSScheduler.prototype.ready = function(){
		if(this._lastRunning && this._lastRunning.remainingTime === 0){
			this._running = null;
		}

		if(this._running === null && this._waiting.getLength() > 0){
			this._running = this._waiting.removeHead();
		}
	}


	FCFSScheduler.prototype.acceptProcess = function(process){
		if(this._running === null){
			this._running = process;
		}else{
			this._waiting.insert(process);
		}
	}


	FCFSScheduler.prototype.step = function(){
		if(this._running){
			this._running.remainingTime--;
		}

		this._lastRunning = this._running;
	}


	Schedulers.FCFSScheduler = FCFSScheduler;


})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);