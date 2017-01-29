(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var Process = global.CPUscheduling.Process,
		LinkedList = global.CPUscheduling.LinkedList,
		Record = global.CPUscheduling.Record;



	/**
	 *	A simulator for the processes inside a machine
	 *
	 *	Time is incremented in discrete steps until all of the processes has been completed.
	 *	Processes arrives as specified, and needs to use N steps of the processor's time to complete. 
	 */
	function ProcessManager(){
		// compareArrivalTime ensures list is sorted in ascending arrival time
		this._processData = new LinkedList(compareArrivalTime, getProcessID);
		this._scheduler = null;
	}


	ProcessManager.prototype.addProcess = function(id, burstTime, arrivalTime, priority, level){
		// Add  argument validation later
		if(typeof priority === "undefined"){
			priority = Process.NO_VALUE;
		}

		if(typeof level === "undefined"){
			level = null;
		}

		this._processData.insert({
			insertLevel: level,
			process: new Process(id, burstTime, arrivalTime, priority)
		});
	}


	ProcessManager.prototype.removeProcess = function(id){
		return this._processData.remove(id);
	}


	// Note to self: getters and setters are good if you want abstraction,
	// and allows the underlying implementation to be changed without changing
	// the interface. Don't be afraid to use them if needed!
	ProcessManager.prototype.setScheduler = function(scheduler){
		this._scheduler = scheduler;
	}


	ProcessManager.prototype.getScheduler = function(){
		return this._scheduler;
	}


	/*
	 * Returns an array containing the processes. It is ordered based on when it was added.
	 *
	 */
	ProcessManager.prototype.getProcesses = function(){
		var processList = [],
			itr = this._processData.getIterator();

		while(itr.hasNext()){
			processList[processList.length] = itr.getNext();
		}

		return processList;
	}


	ProcessManager.prototype.getProcessIDs = function(){
		var itr = this._processData.getIterator(),
			ids = [];

		while(itr.hasNext()){
			ids[ids.length] = itr.getNext().process.id;
		}

		return ids;
	}


	ProcessManager.prototype.run = function(){
		var processDataItr = this._processData.getIterator(),
			time = 0, 
			running, nextArrivalTime, process,
			nextProcessData = null,
			record;
		

		if(!processDataItr.hasNext()){
			return;
		}

		if(this._scheduler.isMultilevel()){
			record = new Record(this.getProcessIDs(), this._scheduler.getNumLevels());
		}else{
			record = new Record(this.getProcessIDs());	
		}
		
		running = true;
		nextArrivalTime = processDataItr.peekNext().process.arrivalTime;

		while(running){
			if(processDataItr.hasNext() && time === nextArrivalTime){
				// Add arriving process to scheduler
				do{
					nextProcessData = processDataItr.getNext();
					this._scheduler.newArrivingProcess(nextProcessData.process, nextProcessData.level);
				}while(processDataItr.hasNext() && processDataItr.peekNext().process.arrivalTime === time);

				if(processDataItr.hasNext()){
					nextArrivalTime = processDataItr.peekNext().process.arrivalTime;
				}
			}

			// scheduler step
			this._scheduler.step();
			
			if(this._scheduler.hasRunningProcess()){
				process = this._scheduler.getRunningProcess();

				if(process.burstTime === (process.remainingTime + 1)){
					process.startTime = time;
				}
				if(process.remainingTime === 0){
					process.endTime = time;
				}
			}

			// check if still running
			if(!processDataItr.hasNext() && !this._scheduler.hasRunningProcess()){
				running = false;
			}else{
				record.log(this._scheduler.getRunningProcess(), this._scheduler.getWaitingProcesses());
				time++;
			}
		}

		return record;
	}



	/* -------------------------------------------------------- *\
						Auxillary Functions
	\* -------------------------------------------------------- */
	
	/*
	 *	Data structure:
	 *		- level
	 *		- process
	 */
	function compareArrivalTime(p1, p2){
		var at1 = p1.process.arrivalTime,
			at2 = p2.process.arrivalTime;

		if(at1 > at2){
			return 1;
		}else
		if(at1 < at2){
			return -1;
		}else{
			return 0;
		}
	}


	function getProcessID(p){
		return p.process.id;
	}


	global.CPUscheduling.ProcessManager = ProcessManager;

})(this);