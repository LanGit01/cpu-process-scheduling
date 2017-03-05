/**
 *
 *	Single Level Timestep Entry:
 *		
 *		entry: {
 *			running: process,
 *			waiting: Array<process>
 *		}
 *
 *
 *	Multi Level Timestep Entry
 *
 *		entry: {
 *			running: process
 *			waiting: Array<process>
 *			levelmap: Map<id, level>
 *		}
 */
 (function(Core){
 	/*
 	 *	Required modules/classes
 	 *		ProcessScheduling.Core
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


 	Record.prototype.notifyTimestepOccurred = function(){
 		var running, waiting, i, waitingIDs = [];

 		if(this._boundScheduler === null){
 			return;
 		}

 		running = this._boundScheduler.getRunning();
 		waiting = this._boundScheduler.getWaiting();

 		for(i = 0; i < waiting.length; i++){
 			waitingIDs[i] = createProcessLogData(waiting[i].id);
 		}

 		this._logs.push({
 			running: running && createProcessLogData(running),
 			waiting: waiting
 		});
 	};


 	Record.prototype.clearLogs = function(){
 		this._logs = [];
 	};


 	Record.prototype.getLogs = function(){
 		return this._logs;
 	};


 	Core.Record = Record;


 	function createProcessLogData(p){
 		return {
 			id: p.id,
 			remainingTime: p.remainingTime
 		};
 	}

 })(ProcessScheduling.Core);