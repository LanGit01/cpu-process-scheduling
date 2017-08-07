define(["Schedulers/SimpleScheduler", "Utils/LinkedList"], function(SimpleScheduler, LinkedList){
	/**
	 *	Scheduler using the Round Robin scheduling algorithm
	 */
	function RRScheduler(quanta){
		SimpleScheduler.call(this, new LinkedList(null, function(process){
			return process.id;
		}));
		
		this._quanta = quanta;
		this._remainingQuanta = 0;
	}


	RRScheduler.subclass(SimpleScheduler);
	

	RRScheduler.prototype.shouldPreempt = function(){
		return (this._running !== null && this._running.remainingTime > 0 && this._remainingQuanta === 0);
	};


	RRScheduler.prototype.step = function(){
		// Check for termination
		if(this.runningTerminated()){
			this._running = null;
		}

		// Check for preemption
		if(this.shouldPreempt()){
			this._waiting.insert(this._running);
			this._running = null;
		}

		// Select process to run
		if(!this.hasRunning() && this.hasWaiting()){
			this._running = this._waiting.removeHead();
			this._remainingQuanta = this._quanta;
		}

		if(this.hasRunning()){
			this._running.remainingTime--;
			this._remainingQuanta--;
		}
	};


	return RRScheduler;
});