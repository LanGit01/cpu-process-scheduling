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

	/* -------------------------------------------------------- *\
						Auxillary Functions
	\* -------------------------------------------------------- */
	
	function createPreemptedComparatorObject(){
		/*	Makes sure the preempted process is on the tail	
		 * 
		 *	This works because the element is inserted after all elements <= to it.
		 *	The preempted is treated as largest, while others are treated as equal.
		 *
		 *	NOTE: This is just coincidence, and I actually think this is bad code because it would not work
		 *		  if not for that coincidence T_T
		 *	
		 *		  Should have had insertBefore method in LinkedList
		 */
		return (function(){
			var preempted = null;

			return {
				comparator: function(a, b){
					// preempted > everything
					
					if(preempted !== null){
						if(b === preempted){
							return -1;
						}else
						if(a === preempted){
							return 1;
						}
					}

					return 0;
				},

				setPreempted: function(process){
					preempted = process;
				}
			}	
		})();
	}

	




})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);