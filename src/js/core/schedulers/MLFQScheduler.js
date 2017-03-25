(function(Schedulers){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Core.Schedulers.RRScheduler
	 */

	var MultilevelScheduler = Schedulers.MultilevelScheduler,
		RRScheduler = Schedulers.RRScheduler;

	/**
	 *	Scheduler using the Multilevel Feedback Queue algorithm
	 */
	function MLFQScheduler(preemptive, bottomLevelScheduler, levelQuanta){
		MultilevelScheduler.call(this, createLevels(bottomLevelScheduler, levelQuanta), preemptive);
	}


	MLFQScheduler.subclass(MultilevelScheduler);


	MLFQScheduler.prototype.acceptProcess = function(process){
		if(this._levels.length === 0){
			return;
		}

		// Always add to topmost level
		this._levels[0].acceptProcess(process);
		this._topIndex = 0;
	}


	MLFQScheduler.prototype.step = function(){
		var shouldReevaluate, top, current, level;

		if(!this.hasProcess()){
			return;
		}

		top = this._topIndex;
		current = this._currentIndex;

		/*
			When to reevaluate
			- no current running and has running
			- has higher level and preemptive
			- no higher level, current running terminated and no waiting
			- no higher level, current running preempted and no waiting
		*/
		if(current === this._levels.length){
			shouldReevaluate = true;
		}else{
			level = this._levels[current];

			if(this.runningTerminated()){
				// Check for termination
				level.removeProcess(level.getRunning().id);
				shouldReevaluate = (top < current || !level.hasWaiting());
			}else
			if(level.shouldPreempt()){
				if(current < this._levels.length - 1){
					this._levels[current + 1].acceptProcess(level.removeProcess(level.getRunning().id));
				}
				shouldReevaluate = (top < current || !level.hasWaiting());
			}

			shouldReevaluate = shouldReevaluate || (top < current && this._preemptive);
		}

		if(shouldReevaluate){
			this._top = this._currentIndex = current = this._findTopLevel();
		}

		if(current < this._levels.length){
			this._levels[current].step();
		}
	}


	function createLevels(bottomLevelScheduler, levelQuanta){
		var levels = [], i;

		for(i = 0; i < levelQuanta.length; i++){
			levels[i] = new RRScheduler(levelQuanta[i]);
		}

		levels[i] = bottomLevelScheduler;

		return levels;
	}


	Schedulers.MLFQScheduler = MLFQScheduler;

})(ProcessScheduling.Core.Schedulers);