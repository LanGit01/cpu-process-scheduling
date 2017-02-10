(function(Schedulers, Utils){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Utils
	 */
	var LinkedList = Utils.LinkedList,
		SimpleScheduler = Schedulers.SimpleScheduler;

	/**
	 *	Scheduler using the Round Robin scheduling algorithm
	 */
	function RRScheduler(quanta){
		this._running = null;
		this._waiting = new LinkedList();

		this._quanta = quanta;
		this._remainingQuanta = 0;
	}


	RRScheduler.subclass(SimpleScheduler);
	

	RRScheduler.prototype.shouldPreempt = function(){
		return (this._running !== null && this._running.remainingTime > 0 && this._remainingQuanta === 0);
	}


	RRScheduler.prototype.ready = function(){

	}


	RRScheduler.prototype.acceptProcess = function(process){
		this._waiting.insert(process);
	}


	RRScheduler.prototype.step = function(){
		
		if(this._running){
			if(this._running.remainingTime === 0){
				// Check for termination, remove terminated process
				this._running = null;
			}else
			if(this._remainingQuanta === 0){
				// Check for preemption
				this._waiting.insert(this._running);
				this._running = null;
			}
		}

		// Select process to run
		if(this._running === null && this._waiting.getLength() > 0){
			this._running = this._waiting.removeHead();
			this._remainingQuanta = this._quanta;
		}

		if(this._running){
			this._running.remainingTime--;
			this._remainingQuanta--;
		}
	}


	Schedulers.RRScheduler = RRScheduler;


})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);