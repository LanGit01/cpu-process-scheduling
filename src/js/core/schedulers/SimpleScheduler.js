(function(Schedulers){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 */

	/**
	 *	Base (abstract) class for the simple schedulers: FCFS, SJF, Priority, and Round Robin
	 */
	function SimpleScheduler(list){
		this._running = null;
		this._waiting = list;
	}


	SimpleScheduler.prototype = {
		constructor: SimpleScheduler,
		hasRunning: function(){
			return (this._running !== null);
		},

		hasWaiting: function(){
			return (this._waiting.getLength() > 0);
		},

		hasProcess: function(){
			return (this.hasRunning() || this.hasWaiting());
		},

		/**
		 *	@return {Process} - running process
		 */
		getRunning: function(){
			return this._running;
		},

		/**
		 *	@return {Array<Process>} - list of waiting processes
		 */
		getWaiting: function(){
			return this._waiting.toArray();
		},

		/**
		 *	Note that there are no guarantees in the ordering of the returned array.
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

		/**
		 *	Returns true if the current running process only started running this time step.
		 *	Or rather, if it is the first time it used the processor's resources.
		 *
		 *	@return true if first time running
		 *			falsy if not, or if there is no running process
		 */
		hasNewStartingProcess: function(){
			return (this._running && this._running.burstTime === (this._running.remainingTime + 1));
		},

		/**
		 *	@return true if the current running process is terminated this time step.
		 *			falsy if not, or if there is no running process
		 */
		runningTerminated: function(){
			return (this._running && this._running.remainingTime === 0);
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
			return false;
		},

		contains: function(id){

		},

		acceptProcess: function(process){
			this._waiting.insert(process);
		},

		/**
		 *	Removes the process that matches the argument id from the scheduler
		 *
		 *	@return the process removed
		 *			null if none removed
		 */
		removeProcess: function(id){
			var process = null;

			if(this._running && this._running.id === id){
				process = this._running;
				this._running = null;
			}else{
				process = this._waiting.remove(id);
			}

			return process;
		},

		/**
		 *	Should be overriden by subclasses.
		 */
		step: function(){}
	};

	Schedulers.SimpleScheduler = SimpleScheduler;

})(ProcessScheduling.Core.Schedulers);