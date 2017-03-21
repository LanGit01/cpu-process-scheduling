(function(Schedulers, Utils){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Utils	
	 */

	var LinkedList = Utils.LinkedList,
		MultilevelScheduler = Schedulers.MultilevelScheduler;


	function MLQScheduler(preemptive, schedulers){
		MultilevelScheduler.call(this, schedulers, preemptive);
	}


	MLQScheduler.subclass(MultilevelScheduler);


	MLQScheduler.prototype.acceptProcess = function(process, level){
		if((!level && level !== 0) || level > this._levels.length - 1){
			return;
		}

		this._levels[level].acceptProcess(process);
		if(level < this._topIndex){
			this._topIndex = level;
		}
	}


	MLQScheduler.prototype.step = function(){
		var shouldReevaluate, top, current, level;
		
		if(!this.hasProcess()){
			return;
		}

		top = this._topIndex;
		current = this._currentIndex;

		if(current === this._levels.length){
			shouldReevaluate = true;
		}else{
			level = this._levels[current];
			// Check for termination
			if(this.runningTerminated()){
				level.removeProcess(level.getRunning().id);
				shouldReevaluate = (top < current || !level.hasWaiting());
			}else
			if((top < current) && (level.shouldPreempt() || this._preemptive)){
				shouldReevaluate = true;
			}
		}

		if(shouldReevaluate){
			this._topIndex = this._currentIndex = current = this._findTopLevel();
		}

		if(current < this._levels.length){
			this._levels[current].step();
		}

	}

	Schedulers.MLQScheduler = MLQScheduler;

})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);