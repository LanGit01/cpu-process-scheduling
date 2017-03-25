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
		SimpleScheduler.call(this, new LinkedList(null, function(process){
			return process.id;
		}));
	}


	FCFSScheduler.subclass(SimpleScheduler);


	FCFSScheduler.prototype.step = function(){
		// Check for termination, remove terminated process
		if(this.runningTerminated()){
			this._running = null;
		}

		// Select process to run
		if(!this.hasRunning() && this.hasWaiting()){
			this._running = this._waiting.removeHead();
		}

		if(this.hasRunning()){
			this._running.remainingTime--;
		}
	};


	Schedulers.FCFSScheduler = FCFSScheduler;


})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);