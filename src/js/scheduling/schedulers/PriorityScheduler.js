(function(Schedulers, Utils){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Utils	
	 */

	var LinkedList = Utils.LinkedList,
		SimpleScheduler = Schedulers.SimpleScheduler;


	/**
	 *	Scheduler using the Priority scheduling algorithm
	 */
	function PriorityScheduler(preemptive){
		this._running = null;
		this._waiting = new LinkedList(comparePriority);
		this._preemptive = preemptive;
	}


	PriorityScheduler.subclass(SimpleScheduler);


	PriorityScheduler.prototype.ready = function(){
		
	}


	PriorityScheduler.prototype.acceptProcess = function(process){
		this._waiting.insert(process);
	}


	PriorityScheduler.prototype.step = function(){
		// Check for termination
		if(this._running && this._running.remainingTime === 0){
			this._running = null;
		}

		// Select process to run
		if(this._preemptive && this._running !== null && this._waiting.getLength() > 0){
			// Preempt if priority value is less than the highest priority value in waiting
			if(comparePriority(this._running, this._waiting.elementAt(0)) > 0){
				this._waiting.insert(this._running);
				this._running = null;
			}
		}

		if(this._running === null && this._waiting.getLength() > 0){
			this._running = this._waiting.removeHead();
		}

		if(this._running){
			this._running.remainingTime--;
		}

		this._lastRunning = this._running;
	}


	Schedulers.PriorityScheduler = PriorityScheduler;

	/* -------------------------------------------------------- *\
						Auxillary Functions
	\* -------------------------------------------------------- */

	/*
	 *	lower number -> higher priority
	 */
	function comparePriority(p1, p2){
		if(p1.priority > p2.priority){
			return 1;
		}else
		if(p1.priority < p2.priority){
			return -1;
		}else{
			return 0;
		}
	}


})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);