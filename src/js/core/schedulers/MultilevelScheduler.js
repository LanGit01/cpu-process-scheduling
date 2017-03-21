(function(Schedulers){

	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 */

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
		acceptProcess: function(){},
		
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

		getRunning: function(){
			if(this._currentIndex < this._levels.length){
				return this._levels[this._currentIndex].getRunning();
			}

			return null;
		},

		getWaiting: function(){
			var waiting = [], levelWaitingList, levelIndex, i;

			for(levelIndex = this._topIndex; levelIndex < this._levels.length; levelIndex++){
				if(levelIndex === this._currentIndex){
					levelWaitingList = this._levels[levelIndex].getWaiting();
				}else{
					levelWaitingList = this._levels[levelIndex].getProcesses();
				}

				for(i = 0; i < levelWaitingList.length; i++){
					waiting[waiting.length] = levelWaitingList[i];
				}
			}

			return waiting;
		},

		hasProcess: function(){
			return (this._topIndex < this._levels.length);
		},

		runningTerminated: function(){
			return (this.hasRunning() && this._levels[this._currentIndex].runningTerminated());
		},

		shouldPreempt: function(){
			return (this._preemptive && this._topIndex < this._currentIndex);
		},

		hasNewStartingProcess: function(){
			return (this.hasRunning() && this._levels[this._currentIndex].hasNewStartingProcess());
		},

		contains: function(){},

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

		_findTopLevel: function(){
			for(var topLevel = this._topIndex; topLevel < this._levels.length; topLevel++){
				if(this._levels[topLevel].hasProcess()){
					break;
				}
			}

			return topLevel;
		},
	}


	Schedulers.MultilevelScheduler = MultilevelScheduler;

})(ProcessScheduling.Core.Schedulers);