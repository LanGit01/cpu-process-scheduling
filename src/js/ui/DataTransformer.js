(function(global){

	var DataTransformer = {
		transform: function(record){
			var rowids, rowidPrefix, log, logItr, transformFunc, i,
				waiting, newWaiting, newLogs = [];

			var rowids, rowidPrefix,
				log, logItr, i,
				waiting, newWaiting, newLogs = [],
				transformFunc;


			if(record.isMultilevel()){
				rowids = [];

				for(i = 0; i < record.getNumLevels(); i++){
					rowids[i] = i;
				}

				transformFunc = multilevelTransform;
				rowidPrefix = "L";
			}else{
				rowids = record.getPIDs();
				transformFunc = singlelevelTransform;
				rowidPrefix = "P";
			}

			// Transform logs
			logItr = record.getLogs().getIterator();
			while(logItr.hasNext()){
				log = logItr.getNext();

				// transform each waiting
				waiting = log.waiting;
				newWaiting = [];
				for(i = 0; i < waiting.length; i++){
					newWaiting[i] = transformFunc(waiting[i]);
				}

				newLogs[newLogs.length] = {
					running: transformFunc(log.running),
					waiting: newWaiting
				}
			}

			return {
				rowids: rowids,
				logs: newLogs
			}
		}
	}

	

	function singlelevelTransform(d){
		if(!d){
			return null;
		}

		return {
			rowid: d.process.id,
			pid: d.process.id
		};
	}


	function multilevelTransform(d){
		if(!d){
			return null;
		}

		return {
			rowid: d.level,
			pid: d.process.id
		};
	}


	global.CPUscheduling.DataTransformer = DataTransformer;

})(this);