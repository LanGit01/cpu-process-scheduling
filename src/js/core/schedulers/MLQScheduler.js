(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var LinkedList = global.CPUscheduling.LinkedList;


	// Get methods could probably use some caching

	/**
	 *	Implementation of the "Multilevel Queue" scheduling strategy
	 */
	function MLQScheduler(preemptive, schedulers){
		this._levels = schedulers;
		this._runningLevel = schedulers.length;
		this._top = schedulers.length;
		this._preemptive = preemptive;

	}


	MLQScheduler.prototype.newArrivingProcess = function(process, level){
		// level is zero-indexed
		if(level < 0 || level > this._levels.length - 1){
			return;
		}

		this._levels[level].newArrivingProcess(process);
		
		if(this._top > level){
			this._top = level;
		}
	}


	MLQScheduler.prototype.isMultilevel = function(){
		return true;
	}


	MLQScheduler.prototype.getNumLevels = function(){
		return this._levels.length;
	}


	MLQScheduler.prototype.hasRunningProcess = function(){
		return this._runningLevel < this._levels.length && this._levels[this._runningLevel].hasRunningProcess();
	}


	MLQScheduler.prototype.getRunningProcess = function(){
		if(this._runningLevel < this._levels.length){
			return {
				level: this._runningLevel,
				process: this._levels[this._runningLevel].getRunningProcess()
			}
		}

		return null;
	}


	MLQScheduler.prototype.hasWaitingProcesses = function(){
		var i, p, level, hasWaiting = false;

		for(i = this._top; i < this._levels.length && !hasWaiting; i++){
			level = this._levels[i];

			if(i === this._runningLevel){
				hasWaiting = this._levels[i].hasWaitingProcesses();
			}else{
				p = level.getRunningProcess();
				hasWaiting = level.hasWaitingProcesses() || (p !== null && p.remainingTime > 0);
			}
		}

		return hasWaiting;
	}


	MLQScheduler.prototype.getWaitingProcesses = function(){
		var currentLevel, levelScheduler, running, hasWaiting,
			waitingArr = [];

		for(currentLevel = this._top; currentLevel < this._levels.length; currentLevel++){
			levelScheduler = this._levels[currentLevel];
			running = levelScheduler.getRunningProcess();
			hasWaiting = levelScheduler.hasWaitingProcesses();

			if(currentLevel !== this._runningLevel && (running && running.remainingTime > 0)){
				waitingArr[waitingArr.length] = {
					level: currentLevel,
					process: levelScheduler.getProcesses()
				};
			}else
			if(hasWaiting){
				waitingArr[waitingArr.length] = {
					level: currentLevel,
					process: levelScheduler.getWaitingProcesses()
				};
			}
		}

		return waitingArr;
	}


	MLQScheduler.prototype.step = function(){
		var shouldReevaluate, running, level,
			hasUnemptyLevel,
			numLevels = this._levels.length;

		/*
			Should reevaluate when:
				1. a process terminates/is preempted and top < running level
				2. a process terminates/is preempted and there is no waiting process in the same level

			Reevaluation:
				Assumptions:
					- this._top always points to the highest unempty level

				Algorithm:
					1. From this._top to end of levels, do:
						- step the scheduler at the current level
						- if there is running, finish the loop and set top = current level
					2. If there are no unempty levels, set both top and runningLevel to length of level array
		 */
		if(this._top < numLevels){
			shouldReevaluate = (this._runningLevel === numLevels);

			// Check for termination
			if(this._runningLevel < numLevels){
				level = this._levels[this._runningLevel];
				running = level.getRunningProcess();
				shouldReevaluate = ((running && running.remainingTime === 0) || level.shouldPreempt()) && (this._top < this._runningLevel || !level.hasWaitingProcesses());

				// Check for preemption
				shouldReevaluate = shouldReevaluate || (this._preemptive && this._top < this._runningLevel);
			}

			if(shouldReevaluate){
				this._runningLevel = this._top;
				hasUnemptyLevel = false;

				while(this._runningLevel < numLevels && !hasUnemptyLevel){
					level = this._levels[this._runningLevel];
					level.step();

					if(level.hasRunningProcess()){
						hasUnemptyLevel = true;
					}else{
						this._runningLevel++;
					}
				}

				this._top = this._runningLevel;
			}else{
				this._levels[this._runningLevel].step();
			}
		}
	}

	global.CPUscheduling.MLQScheduler = MLQScheduler;

})(this);