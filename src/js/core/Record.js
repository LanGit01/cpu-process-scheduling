define(function(){
	/**
 	 *	Records the state of the scheduler bound to the instance.
 	 *
 	 *	An instance of this class is an observer. It fetches and logs data from the bound
 	 *	scheduler every time it is notified (`notifyTimeStepOccured` is called).
 	 *
 	 *	It stores the data on a list of Logs. The Log data structures is:
 	 *
 	 *		Log: {
 	 *			running: {Process},
 	 *			waiting: {Array.<Process>},
 	 *			levelmap: {Object.<id, level>}
 	 *		}
 	 *
 	 *	Log.levelmap is only present on multilevel schedulers' logs
 	 */
 	function Record(){
 		this._logs = [];
 		this._boundScheduler = null;
 	}


 	Record.prototype.bindScheduler = function(scheduler){
 		if(!scheduler || !scheduler.getRunning || !scheduler.getWaiting){
 			return false;
 		}

 		this.clearLogs();
 		this._boundScheduler = scheduler;
 	};


 	Record.prototype.releaseScheduler = function(){
 		var scheduler = this._boundScheduler;
 		this._boundScheduler = null;
 		return scheduler;
 	};


 	/**
 	 *	Notify this that data should be fetched
 	 */
 	Record.prototype.notifyTimestepOccurred = function(){
 		var running, waiting, i, log;

 		if(this._boundScheduler === null){
 			return;
 		}

 		running = this._boundScheduler.getRunning();
 		waiting = this._boundScheduler.getWaiting();

 		log = {
 			running: running && createProcessLogData(running),
 			waiting: waiting && waiting.map(createProcessLogData)
 		};

 		if(this._boundScheduler.getProcessLevelMap){
 			log.processLevelMap = this._boundScheduler.getProcessLevelMap();
 		}

 		this._logs.push(log);
 	};


 	Record.prototype.clearLogs = function(){
 		this._logs = [];
 	};


 	Record.prototype.getLogs = function(){
 		return this._logs;
 	};


 	function createProcessLogData(p){
 		return {
 			id: p.id,
 			remainingTime: p.remainingTime
 		};
 	}

 	return Record;
});