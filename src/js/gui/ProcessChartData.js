define(["Utils/selectionSort"], function(selectionSort){

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
		//this._logs = logs.map(filterLogFunc(level));
		this._logs = logs.map(filterLogFunc(level));
		this._ids = selectionSort(this._logs.reduce(addUniqueIDs, []), function(a, b) { return a - b; });
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


	function filterLogFunc(level){
		var hasLevel = (level >= 0);

		function shouldInclude(log, process){
			return (!hasLevel || log.processLevelMap[process.id] === level);
		}

		return function(log){
			var running = log.running, waiting = log.waiting;

			return {
				running: (running && shouldInclude(log, running) ? running : null),
				waiting: waiting.filter(function(process){
					return shouldInclude(log, process);
				})
			}
		}
	}


	function addUniqueIDs(arr, log){
		var id;

		if(log.running && arr.indexOf(log.running.id) == -1){
			arr.push(log.running.id);
		}

		for(var i = 0; i < log.waiting.length; i++){
			id = log.waiting[i].id;

			if(arr.indexOf(id) == -1){
				arr.push(id);
			}
		}

		return arr;
	}



	return ProcessChartData;
});