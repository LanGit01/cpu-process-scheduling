(function(global){

	var DataTransformer = {
		/**
		 *	Returns an object {rowids, logs}
		 *
		 *	logs [array] = {
		 *		running: markData, 
		 *		waiting: Array[markData]
		 *	}
		 *
		 *	markData = {rowid, pid}
		 */
		transform: function(record){
			var transformLog, rowids, logs, logsItr,
				log, numLevels, i;

			if(record.isMultilevel()){
				transformLog = transformLogMultilevel;

				numLevels = record.getNumLevels();
				i = 0;
				rowids = [];
				while(i < numLevels){
					rowids[i] = i++;
				}

			}else{
				transformLog = transformLogSimple;
				rowids = record.getPIDs();
			}

			logs = [];
			logsItr = record.getLogs().getIterator();
			while(logsItr.hasNext()){
				logs[logs.length] = transformLog(logsItr.getNext());
			}

			return {
				rowids: rowids,
				logs: logs
			}
		}

	}


	/*---------------------------------------------*\
					Private Functions
	\*---------------------------------------------*/



	function transformLogSimple(log){
		var newLog = {}, newWaiting = [], i,
			running = log.running,
			waiting = log.waiting;

		if(running){
			newLog.running = {
				rowid: running.id,
				pid: running.id
			};
		}

		for(i = 0; i < waiting.length; i++){
			newWaiting[i] = {
				rowid: waiting[i].id,
				pid: waiting[i].id
			}
		}

		newLog.waiting = newWaiting;
		return newLog;
	}


	function transformLogMultilevel(log){
		var newLog = {}, newWaiting = [], i, level = -1,
			running = log.running,
			waiting = log.waiting;

		if(running){
			newLog.running = {
				rowid: running.level,
				pid: running.id,
			};

			level = running.level;
		}

		for(i = 0; i < waiting.length; i++){
			if(waiting[i].level > level){
				level = waiting[i].level;

				newWaiting[newWaiting.length] = {
					rowid: level,
					pid: waiting[i].id
				};
			}
		}

		newLog.waiting = newWaiting;
		return newLog;
	}


	function transformSinglelevelRunning(process){
		if(!process){
			return null;
		}

		return {
			rowid: process.id,
			pid: process.id
		};
	}


	function transformMultilevelRunning(process){
		if(!process){
			return null;
		}

		return {
			rowid: process.level,
			pid: process.id
		};
	}


	function transformSinglelevelWaiting(waiting){
		var i, newWaiting = [], id;

		for(i = 0; i < waiting.length; i++){
			pid = waiting[i].id;

			newWaiting[i] = {
				rowid: pid,
				pid: pid
			}
		}

		return newWaiting;
	}


	function transformMultilevelWaiting(waiting){
		var i, level = -1, newWaiting = [];

		for(i = 0; i < waiting.length; i++){
			if(waiting[i].level > level){
				level = waiting[i].level;

				newWaiting[newWaiting.length] = {
					rowid: level,
					pid: level.pid
				}
			}
		}

		return newWaiting;
	}
	

	global.CPUscheduling.DataTransformer = DataTransformer;

})(this);