(function(global){

	var LinkedList = global.CPUscheduling.LinkedList;


	function Record(pids, levels){
		this._pids = pids;
		this._logs = new LinkedList();
		this._levels = levels || null;

		this._createProcessLog = (this.isMultilevel() ? multilevelCreateProcessLog : singlelevelCreateProcessLog);
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

	// running: process OR object
	// waiting: array of process OR array of object
	//


	Record.prototype.log = function(runningProcess, waitingProcesses){
		/*var i, waiting = [], itr = waitingProcesses.getIterator();

		while(itr.hasNext()){
			waiting[waiting.length] = this._createProcessLog(itr.getNext());
		}*/

		var i, waiting = [];

		for(i = 0; i < waitingProcesses.length; i++){
			waiting[waiting.length] = this._createProcessLog(waitingProcesses[i]);
		}

		this._logs.insert({
			running: this._createProcessLog(runningProcess),
			waiting: waiting
		});
	}



	Record.prototype.getLogs = function(){
		return this._logs;
	}


	Record.prototype.log = function(runningProcess, waitingProcesses){
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
		 var i, waiting = [];

		 if(this.isMultilevel()){

		 }
	}


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


	/*---------------------------------------------*\
					Private Functions
	\*---------------------------------------------*/


	global.CPUscheduling.Record = Record;

})(this);