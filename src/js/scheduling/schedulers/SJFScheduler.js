(function(Schedulers, Utils){
	/**
	 *	Required Modules:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Utils
	 */
	var LinkedList = Utils.LinkedList,
		SimpleScheduler = Schedulers.SimpleScheduler;


	/**
	 *	Scheduler using the Shortest Job First(non-preemptive) or Shortest Remaining Time First(preemptive)
	 *	scheduling algorithm
	 */
	function SJFScheduler(preemptive){
		this._running = null;
		this._waiting = null;
		this._preemptive = preemptive;

		if(preemptive){
			this._waiting = new LinkedList(compareBurstTime);
		}else{
			this._waiting = new LinkedList(compareRemainingTime);
		}
	}


	SJFScheduler.subclass(SimpleScheduler);

	SJFScheduler.prototype.ready = function(){

	}


	SJFScheduler.prototype.shouldPreempt = function(){
		if(!this._preemptive){
			return false;
		}

		return (this._running !== null && this._waiting.getLength() > 0 && compareRemainingTime(this._running, this._waiting.elementAt(0)) > 0);
	}


	SJFScheduler.prototype.acceptProcess = function(process){
		this._waiting.insert(process);
	}


	SJFScheduler.prototype.step = function(){
		if(this._running){
			if(this._running.remainingTime === 0){
				// Running process terminated
				this._running = null;
			}else
			if(this._preemptive && this._waiting.getLength() > 0 && compareRemainingTime(this._running, this._waiting.elementAt(0)) > 0){
				// Running process preempted
				this._waiting.insert(this._running);
				this._running = null;
			}
		}

		if(this._running === null){
			this._running = this._waiting.removeHead();
		}

		if(this._running){
			this._running.remainingTime--;
		}
	}


	Schedulers.SJFScheduler = SJFScheduler;

	/* -------------------------------------------------------- *\
						Auxillary Functions
	\* -------------------------------------------------------- */
	

	function compareBurstTime(p1, p2){
		if(p1.burstTime > p2.burstTime){
			return 1;
		}else
		if(p1.burstTime < p2.burstTime){
			return -1;
		}else{
			return 0;
		}
	}


	function compareRemainingTime(p1, p2){
		if(p1.remainingTime > p2.remainingTime){
			return 1;
		}else
		if(p1.remainingTime < p2.remainingTime){
			return -1;
		}else{
			return 0;
		}
	}


})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);