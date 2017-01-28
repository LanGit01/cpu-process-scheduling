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
		var i, waiting = [], itr = waitingProcesses.getIterator();

		while(itr.hasNext()){
			waiting[waiting.length] = this._createProcessLog(itr.getNext());
		}

		this._logs.insert({
			running: this._createProcessLog(runningProcess),
			waiting: waiting
		});
	}


	Record.prototype.getLogs = function(){
		return this._logs;
	}


	/*---------------------------------------------*\
					Private Functions
	\*---------------------------------------------*/
	
	function multilevelCreateProcessLog(d){
		if(!d){
			return null;
		}

		return {
			level: d.level,
			process: {
				id: d.process.id,
				remainingTime: d.process.remainingTime
			}
		};
	}


	function singlelevelCreateProcessLog(d){
		if(!d){
			return null;
		}

		return {
			process: {
				id: d.id,
				remainingTime: d.remainingTime
			}
		};
	}


	global.CPUscheduling.Record = Record;

})(this);