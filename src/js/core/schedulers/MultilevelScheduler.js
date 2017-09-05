define(function(){
	/**
	 *	Base (abstract) class for the multilevel schedulers: MLQ, MLFQ
	 */
	function MultilevelScheduler(levels, preemptive){
		this._levels = levels;
		this._preemptive = preemptive;
		this._topIndex = levels.length;
		this._currentIndex = levels.length;
	}


	MultilevelScheduler.prototype = {
		constructor: MultilevelScheduler,
		hasRunning: function(){
			return (this._currentIndex < this._levels.length && this._levels[this._currentIndex].hasRunning());
		},

		hasWaiting: function(){
			if(!this.hasProcess()){
				return false;
			}

			var i = this._topIndex;

			while(i < this._levels.length){
				if(this._levels[i++].hasWaiting()){
					return true;
				}
			}

			return false;
		},

		/**
		 *	@return {Process} - running process
		 */
		getRunning: function(){
			if(this._currentIndex < this._levels.length){
				return this._levels[this._currentIndex].getRunning();
			}

			return null;
		},

		/**
		 *	@return {Array<Process>} - list of waiting processes
		 */
		getWaiting: function(){
			var waiting = [], levelIndex;

			for(levelIndex = this._topIndex; levelIndex < this._levels.length; levelIndex++){
				if(levelIndex === this._currentIndex){
					waiting.push.apply(waiting, this._levels[levelIndex].getWaiting());
				}else{
					waiting.push.apply(waiting, this._levels[levelIndex].getProcesses());
				}
			}

			return waiting;
		},

		/**
		 *	Note there are no guarantees in the ordering of the returned array.
		 *
		 *	@return {Array<Process>} - list of all process
		 */
		getProcesses: function(){
			var processes = this.getWaiting();
			if(this.hasRunning()){
				processes.push(this.getRunning());
			}
			return processes;
		},
		

		hasProcess: function(){
			return (this._topIndex < this._levels.length);
		},

		/**
		 *	@return true if the current running process is terminated this time step.
		 *			falsy if not, or if there is no running process
		 */
		runningTerminated: function(){
			return (this.hasRunning() && this._levels[this._currentIndex].runningTerminated());
		},

		/**
		 *	Returns true if the current running process will be preempted next timestep.
		 *	This method should be called after all process for this timestep has arrived, and before calling
		 *	'step()'
		 *
		 *	This should be overrided in subclasses.
		 *
		 *	@return true if the current running process should be preempted,
		 *			false if not, or if there is no running process
		 */
		shouldPreempt: function(){
			return (this._preemptive && this._topIndex < this._currentIndex);
		},

		/**
		 *	Returns true if the current running process only started running this time step.
		 *	Or rather, if it is the first time it used the processor's resources.
		 *
		 *	@return true if first time running
		 *			falsy if not, or if there is no running process
		 */
		hasNewStartingProcess: function(){
			return (this.hasRunning() && this._levels[this._currentIndex].hasNewStartingProcess());
		},

		contains: function(){},

		/**
		 *	Returns the process to level mapping. The identifier is the Process, and the value is the Level.
		 *
		 *	@return {Object}
		 *
		 */
		getProcessLevelMap: function(){
			var map = Object.create(null),
				levelIndex, i, processes;

			for(levelIndex = this._topIndex; levelIndex < this._levels.length; levelIndex++){
				processes = this._levels[levelIndex].getProcesses();

				for(i = 0; i < processes.length; i++){
					map[processes[i].id] = levelIndex;
				}
			}

			return map;
		},

		/**
		 *	@return {int} - index of the first non-empty level
		 */
		_findTopLevel: function(){
			for(var topLevel = this._topIndex; topLevel < this._levels.length; topLevel++){
				if(this._levels[topLevel].hasProcess()){
					break;
				}
			}

			return topLevel;
		},
	}

	return MultilevelScheduler;
});