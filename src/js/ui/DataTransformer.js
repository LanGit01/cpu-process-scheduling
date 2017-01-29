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
			var logsItr = record.getLogs().getIterator(), newLogs = [],
				transformRunning, transformWaiting,
				i, numLevels, rowids;


			if(record.isMultilevel()){
				transformRunning = transformMultilevelRunning;
				transformWaiting = transformMultilevelWaiting;
				
				numLevels = record.getNumLevels();
				i = 0;
				rowids = [];
				while(i < numLevels){
					rowids[i] = i++;
				}
			}else{
				transformRunning = transformSinglelevelRunning;
				transformWaiting = transformSinglelevelWaiting;
					
				rowids =  record.getPIDs();
			}


			logIndex = 0;
			while(logsItr.hasNext()){
				log = logsItr.getNext();

				newLogs[logIndex++] = {
					running: transformRunning(log.running),
					waiting: transformWaiting(log.waiting)
				}
			}

			return {
				rowids: rowids,
				logs: newLogs
			};
		}

	}


	/*---------------------------------------------*\
					Private Functions
	\*---------------------------------------------*/

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