define(function(){

	/**
	 *	Wrapper class for log data.
	 *
	 *	Represents a collection of states at each timestep of a Scheduler's level. Each timestep-state(log)
	 *	is an object with the structure:
	 *
	 *		log = {
	 *			running: Process,
	 *			waiting: Array<Process>
	 *		} 
	 *
	 *	If a `level` argument is provided, it will ignore processes not on that level. The logs will show
	 *	only the processes on the specified level.
	 *
	 *	Simple schedulers only has a single level, the `level` parameter MUST be omitted, otherwise there
	 *	will be an error.
	 */
	function ProcessChartData(logs, level){
		if(level || level === 0){
			this._logs = logs.map(function(log){
				return filterLog(log, level);
			});
		}else{
			this._logs = logs.map(function(log){
				return {
					running: log.running,
					waiting: log.waiting
				}
			});
		}	
	}


	ProcessChartData.prototype = {
		constructor: ProcessChartData,

		getNumLogs: function(){
			return this._logs.length;
		},

		getRunning: function(time){
			if(time > -1 && time < this._logs.length){
				return this._logs[time].running;
			}

			return null;
		},

		getWaiting: function(time){
			if(time > -1 && time < this._logs.length){
				return this._logs[time].waiting;
			}

			return null;
		}
	};


	function filterLog(log, level){
		if(!log.processLevelMap){
			throw new Error("Expecting a level map. Level map not found.");
		}

		return {
			running: (log.running && log.processLevelMap[log.running.id] === level ? log.running : null),
			waiting: log.waiting.filter(function(process){
				return log.processLevelMap[process.id] === level;
			})
		};
	}


	return ProcessChartData;
});