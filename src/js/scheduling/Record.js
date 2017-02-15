/**
 *
 *	Multi Level:
 *
 *		entry: {
 *			running: {level, process},
 *			waiting: {
 *				level,
 *				processes: [process]
 *			}
 *			event: 
 *		}
 *
 *	Single Level:
 *
 *		entry: {
 *			running: process
 *			waiting: [process]
 *			event:
 *		}
 *
 *	
 *
 *
 */
 (function(Core){
 	/**
 	 *	Required modules/classes
 	 *		ProcessScheduling.Utils.LinkedList
 	 */

 	function Logger(multilevel){
 		this._logs = [];
 		this.isMultilevel = multilevel;
 	}


 	Logger.prototype.log = function(runningProcess, waitingProcesses){
 		if(this.isMultilevel){

 		}else{
 			this._logs[this._logs.length] = createSingleLevelLog(runningProcess, waitingProcesses);
 		}
 	}


 	Logger.prototype.getLogs = function(){
 		return this._logs;
 	}


 	/*==================================================*\
					Private Functions
	\*==================================================*/
	
 	function createSingleLevelLog(runningProcess, waitingProcesses){
 		var i, waiting = [];

 		for(i = 0; i < waitingProcesses.length; i++){
 			waiting[i] = createProcessLogData(waitingProcesses[i]);
 		}

 		return {
 			running: createProcessLogData(runningProcess),
 			waiting: waiting
 		};
 	}



 	function createProcessLogData(process, level){
 		if(process === null){
 			return null;
 		}

 		var pData = {
 			id: process.id,
 			remainingTime: process.remainingTime
 		};

 		if(level){
 			pData.level = level;
 		}

 		return pData;
 	}


 	Core.Record = {
 		getInstance: function(){
 			return new Logger(false);
 		},

 		getMultiLevelInstance: function(){
 			return new Logger(true);
 		}
 	};


 })(ProcessScheduling.Core);