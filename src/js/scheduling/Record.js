(function(global){

	var LinkedList = global.CPUscheduling.LinkedList;


	function Record(pids, levels){
		this._pids = pids;
		this._logs = new LinkedList();
		this._levels = levels || null;
	}


	Record.prototype.getPIDs = function(){
		return this._pids;
	}


	Record.prototype.getNumLevels = function(){
		return this._levels;
	}


	Record.prototype.isMultilevel = function(){
		return (this._levels !== null)
	}


	Record.prototype.getLogs = function(){
		return this._logs;
	}


	Record.prototype.log = function(running, waiting){
		/**
		 *	Single Level: {
		 *		running: process,
		 *		waiting: Array[process]
		 *	}
		 *
		 *	Multi level: {
		 *		running: process,
		 *		waiting: processes: Array[process]
		 *	}
		 */
		 if(this.isMultilevel()){
		 	this._logs.insert(multilevelLog(running, waiting));
		 }else{
		 	this._logs.insert(singlelevelLog(running, waiting));
		 }
	}



	/*---------------------------------------------*\
					Private Functions
	\*---------------------------------------------*/


	function multilevelLog(runningProcess, waitingLevels){
		var i, j, running, waiting = [], level, waitingProcesses;

		if(runningProcess){
			running = createProcessData(runningProcess.process, runningProcess.level);
		}

		for(i = 0; i < waitingLevels.length; i++){
			level = waitingLevels[i].level
			waitingProcesses = waitingLevels[i].process;

			for(j = 0; j < waitingProcesses.length; j++){
				waiting[waiting.length] = createProcessData(waitingProcesses[j], level);
			}
		}

		return {
			running: running,
			waiting: waiting
		};
	}


	function singlelevelLog(runningProcess, waitingProcesses){
		var i, waiting = [];

		for(i = 0; i < waitingProcesses.length; i++){
			waiting[waiting.length] = createProcessData(waitingProcesses[i]);
		}

		return {
			running: createProcessData(runningProcess),
			waiting: waiting
		}
	}


	function createProcessData(p, level){
		if(!p){
			return null;
		}

		var pData = {
			id: p.id,
			remainingTime: p.remainingTime
		};

		if(level){
			pData.level = level;
		}

		return pData;
	}


	global.CPUscheduling.Record = Record;

})(this);