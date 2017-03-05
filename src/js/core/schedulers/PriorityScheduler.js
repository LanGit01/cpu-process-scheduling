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
		SimpleScheduler.call(this, new LinkedList(comparePriority, function(process){
			return process.id;
		}));
		
		this._preemptive = preemptive;
	}


	PriorityScheduler.subclass(SimpleScheduler);


	PriorityScheduler.prototype.shouldPreempt = function(){
		if(!this._preemptive){
			return false;
		}

		return (this.hasRunning() && this.hasWaiting() && 
			    comparePriority(this._running, this._waiting.elementAt(0)) > 0);
	};


	PriorityScheduler.prototype.step = function(){
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
		}

		if(this.hasRunning()){
			this._running.remainingTime--;
		}

		this._lastRunning = this._running;
	};


	Schedulers.PriorityScheduler = PriorityScheduler;

	/* -------------------------------------------------------- *\
						Auxillary Functions
	\* -------------------------------------------------------- */

	/*
	 *	lower number -> higher priority
	 */
	function comparePriority(p1, p2){
		if(p1.priority > p2.priority){
			return -1;
		}else
		if(p1.priority < p2.priority){
			return 1;
		}else{
			return 0;
		}
	}


})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);