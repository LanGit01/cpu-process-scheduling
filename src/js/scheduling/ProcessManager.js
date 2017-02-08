(function(Core, Utils){
	/**
	 *	Required modules/classes:
	 *		ProcessScheduling.Core
	 */
	var Process = Core.Process,
		LinkedList = Utils.LinkedList;

	/**
	 *	A simulator for the processes inside a machine
	 *
	 *	Time is incremented in discrete steps until all of the processes has been completed.
	 *	Processes arrives as specified, and needs to use N steps of the processor's time to complete. 
	 */
	function ProcessManager(){
		// compareArrivalTime ensures list is sorted in ascending arrival time
		this._processData = new LinkedList(compareArrivalTime, getProcessID);
	}


	ProcessManager.prototype.addProcess = function(id, burstTime, arrivalTime, priority, level){
		// Priority and level is optional depending on the scheduler used
		// (program could crash though if you don't provide required values)
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


	ProcessManager.prototype.run = function(scheduler){
		/*
			Algorithm:

				set time = 0
				while there are processes to arrive OR scheduler is still running
					ready state
					add arriving processes to scheduler
					step state (execute timestep)

			Loading the processes:
				if next arriving process's arrivalTime === time
					while next process === arrivalTime
						add
		*/
		var processDataItr, running, 
			nextArrivalTime, time, processData, 
			process, processClones;


		// If empty, no need to run
		if(this._processData.getLength() > 0){
			processDataItr = this._processData.getIterator();
			processClones = [];
			nextArrivalTime = processDataItr.peekNext().process.arrivalTime;
			time = 0;
			running = true;
		}

		while(running){
			// State 1
			scheduler.ready();
			// Poll for arriving processes
			// Pass copy of arriving processes into scheduler
			while(nextArrivalTime === time){
				processData = processDataItr.getNext();

				process = createProcessCopy(processData.process);
				processClones[processClones.length] = process;
				scheduler.acceptProcess(process, processData.level);	

				if(processDataItr.hasNext()){
					nextArrivalTime = processDataItr.peekNext().process.arrivalTime;
				}else{
					nextArrivalTime = null;
				}
			}

			// State 2
			scheduler.step();

			// Check for termination/start of a new process
			// For process data gathering
			if(scheduler.hasRunning()){
				process = scheduler.getRunning();
				
				if(scheduler.runningTerminated()){
					process.endTime = time;
				}

				if(scheduler.isStartingProcess()){
					process.startTime = time;
				}
			}


			// Check if still running
			if(nextArrivalTime === null && !scheduler.hasRunning() && !scheduler.hasWaiting()){
				running = false;
			}else{
				//console.log("Time: " + time + "\nID: " + scheduler.getRunning().id + "\nRemaining: " + scheduler.getRunning().remainingTime);
				debugLog(scheduler, time);
				time++;
			}
		}

		return processClones;
	}

	Core.ProcessManager = ProcessManager;



	/*==================================================*\
					Private Functions
	\*==================================================*/

	function debugLog(scheduler, time){
		var running = scheduler.getRunning(),
			waiting = scheduler.getWaiting(),
			table = document.getElementById("debug-table").tBodies[0],
			i, tr, td, text;

		tr = table.insertRow();
		tr.insertCell().appendChild(document.createTextNode(time));

		if(running){
			tr.insertCell().appendChild(document.createTextNode(running.id));
			tr.insertCell().appendChild(document.createTextNode((running.priority === Process.NO_VALUE ? "- none -" : running.priority)));
			tr.insertCell().appendChild(document.createTextNode(running.remainingTime));
		}else{
			td = tr.insertCell();
			td.colSpan = 3;
			td.appendChild(document.createTextNode("- no running process -"));
		}

		
		if(waiting.length > 0){
			text = "[";
			for(i = 0; i < waiting.length; i++){
				text += waiting[i].id;
				
				if(i < waiting.length - 1){
					text += ", ";
				}
			}
			text += "]";
			td = tr.insertCell();
			td.appendChild(document.createTextNode(text));
		}else{
			td = tr.insertCell();
			td.appendChild(document.createTextNode("- none -"));
		}
	}

	function createProcessCopy(process){
		return new Process(process.id, process.burstTime, process.arrivalTime, process.priority);
	}

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

})(ProcessScheduling.Core, ProcessScheduling.Utils);