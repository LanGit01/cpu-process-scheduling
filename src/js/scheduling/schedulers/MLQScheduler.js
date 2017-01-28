(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var LinkedList = global.CPUscheduling.LinkedList;


	/**
	 *	Implementation of the "Multilevel Queue" scheduling strategy
	 */
	function MLQScheduler(schedulers){
		this._levels = schedulers;
		this._topOccupiedLevel = 0;

	}


	MLQScheduler.prototype.newArrivingProcess = function(process, level){
		if(level < 0 || level > this._levels.length - 1){
			return;
		}

		this._levels[level].newArrivingProcess(process);

		if(level < this._topOccupiedLevel){
			this._topOccupiedLevel = level;
		}

	}


	MLQScheduler.prototype.isMultilevel = function(){
		return true;
	}


	MLQScheduler.prototype.getNumLevels = function(){
		return this._levels.length;
	}


	MLQScheduler.prototype.hasRunningProcess = function(){
		return (this._levels[this._topOccupiedLevel].hasRunningProcess());
	}


	MLQScheduler.prototype.getRunningProcess = function(){
		if(!this.hasRunningProcess()){
			return null;
		}else{
			return {
				levels: this._topOccupiedLevel,
				process: this._levels[this._topOccupiedLevel].getRunningProcess()
			};
		}
	}


	MLQScheduler.prototype.hasWaitingProcesses = function(){
		var topIndex = this._topOccupiedLevel;

		while(topIndex < this._levels.length && !this._levels[topIndex].hasWaitingProcesses()){
			if(this._levels[topIndex++].hasWaitingProcesses()){
				return true;
			}

		}

		return false;
	}


	MLQScheduler.prototype.getWaitingProcesses = function(){
		var waiting = [], i, j;

		j = 0;
		for(i = topIndex; i < this._levels.length; i++){
			waiting[j++] = {
				level: i,
				processes: this._levels[i].getWaitingProcesses().toArray()
			};
		}

		return waiting;
	}


	MLQScheduler.prototype.step = function(){
		var currentLevel, topIndex = this._topOccupiedLevel - 1;

		// Run topmost process
		// If step is called and no process is run, then the timestep is not consumed
		do{
			topIndex++;
			currentLevel = this._levels[topIndex];
			currentLevel.step();
		}while(topIndex < this.levels.length && !currentLevel.hasRunningProcess());

		// There is no process to run if topIndex === this.levels.length
		this._topOccupiedLevel = topIndex % this.levels.length;
	}



	global.CPUscheduling.MLQScheduler = MLQScheduler;

})(this);