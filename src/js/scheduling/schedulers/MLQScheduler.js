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
		var i, levelScheduler, processes, waitingArr = [];

		for(i = this._top; i < this._levels.length; i++){
			levelScheduler = this._levels[i];

			if(i === this._runningLevel){
				if(levelScheduler.hasWaitingProcesses()){
					waitingArr[waitingArr.length] = {
						level: i,
						process: levelScheduler.getWaitingProcesses()		
					};
				}
			}else
			if(levelScheduler.hasWaitingProcesses() || levelScheduler.hasRunningProcess()){
				waitingArr[waitingArr.length] = {
					level: i,
					process: levelScheduler.getProcesses()
				};
			}
		}

		return waitingArr;
	}


	MLQScheduler.prototype.step = function(){
		var running, hasProcess, level,
			numLevels = this._levels.length;

		// Check if a process terminates
		if(this._top < numLevels){
			running = null;
			hasProcess = true;

			if(this._runningLevel < numLevels){
				level = this._levels[this._runningLevel];
				running = level.getRunningProcess();
				hasProcess = (running && running.remainingTime > 0) || level.hasWaitingProcesses();
			}

			if(running === null || !hasProcess){
				//  || (this._preemptive && this._top < this._runningLevel)

				// Find first nonempty level from top
				this._runningLevel = this._top;
				hasProcess = false;

				while(this._runningLevel < numLevels && !hasProcess){
					level = this._levels[this._runningLevel];
					level.step();

					if(level.hasRunningProcess() || level.hasWaitingProcesses()){
						hasProcess = true;
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