(function(Schedulers, Utils){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core.Schedulers
	 *		ProcessScheduling.Utils	
	 */

	var LinkedList = Utils.LinkedList;


	function MLQScheduler(preemptive, schedulers){
		this._levels = schedulers;
		this._preemptive = preemptive;

		this._top = schedulers.length;
		this._currentLevel = schedulers.length;
	}


	MLQScheduler.prototype.acceptProcess = function(process, level){
		if((!level && level !== 0) || level > this._levels.length - 1){
			return;
		}

		this._levels[level].acceptProcess(process);
		if(level < this._top){
			this._top = level;
		}
	}


	MLQScheduler.prototype.hasRunning = function(){
		return (this._currentLevel < this._levels.length && this._levels[this._currentLevel].hasRunning());
	}


	MLQScheduler.prototype.hasWaiting = function(){
		var i, hasWaiting = false;

		if(!this.hasProcess()){
			return false;
		}

		for(i = this._top; i < this._levels.length && !hasWaiting; i++){
			if(i === this._currentLevel){
				hasWaiting = this._levels[i].hasWaiting();
			}else{
				hasWaiting = this._levels[i].hasProcess();
			}
		}

		return hasWaiting;
	}


	MLQScheduler.prototype.getRunning = function(){
		if(this._currentLevel < this._levels.length){
			return this._levels[this._currentLevel].getRunning();
		}

		return null;
	}


	MLQScheduler.prototype.getWaiting = function(){
		var waiting = [], waitingOnLevel,
			level, i;

		for(levelIndex = this._top; levelIndex < this._levels.length; levelIndex++){
			if(levelIndex === this._currentLevel){
				waitingOnLevel = this._levels[levelIndex].getWaiting();
			}else{
				waitingOnLevel = this._levels[levelIndex].getProcesses();
			}

			for(i = 0; i < waitingOnLevel.length; i++){
				waiting[waiting.length] = waitingOnLevel[i];
			}
		}

		return waiting;
	}


	MLQScheduler.prototype.hasProcess = function(){
		return (this._top < this._levels.length);
	}



	MLQScheduler.prototype.runningTerminated = function(){
		return (this.hasRunning() && this._levels[this._currentLevel].runningTerminated());
	}


	MLQScheduler.prototype.shouldPreempt = function(){
		return (this._preemptive && this._top < this._currentLevel);
	}


	MLQScheduler.prototype.hasNewStartingProcess = function(){
		var running = this.getRunning();

		return !!(running && running.remainingTime + 1 === running.burstTime);
	}


	MLQScheduler.prototype.contains = function(id){

	}


	MLQScheduler.prototype.getProcessLevelMap = function(){
		var map = Object.create(null),
			levelIndex, i, processes;

		for(levelIndex = this._top; levelIndex < this._levels.length; levelIndex++){
			processes = this._levels[levelIndex].getProcesses();

			for(i = 0; i < processes.length; i++){
				map[processes[i].id] = levelIndex;
			}
		}

		return map;
	}


	MLQScheduler.prototype._findTopLevel = function(){
		for(var topLevel = this._top; topLevel < this._levels.length; topLevel++){
			if(this._levels[topLevel].hasProcess()){
				break;
			}
		}

		return topLevel;
	}



	MLQScheduler.prototype.step = function(){
		var shouldReevaluate, top, current, level;
		
		if(!this.hasProcess()){
			return;
		}

		top = this._top;
		current = this._currentLevel;

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
			this._top = this._currentLevel = current = this._findTopLevel();
		}

		if(current < this._levels.length){
			this._levels[current].step();
		}

	}

	Schedulers.MLQScheduler = MLQScheduler;

})(ProcessScheduling.Core.Schedulers, ProcessScheduling.Utils);