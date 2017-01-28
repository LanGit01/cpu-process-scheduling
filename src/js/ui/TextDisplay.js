(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}


	var Process = global.CPUscheduling.Process;


	var TEXT_NONE = "none";

	var headers = ["PID", "BT", "AT", "Priority", "ST", "ET", "WT", "TT", "RT"];


	function getProcessData(header, process){
		var value;

		switch(header){
			case "PID": value = process.id; break;
			case "BT": value = process.burstTime; break;
			case "AT": value = process.arrivalTime; break;
			case "Priority": value = (process.priority === Process.NO_VALUE ? TEXT_NONE : process.priority); break;
			case "ST": value = process.startTime; break;
			case "ET": value = process.endTime; break;
			case "WT": value = process.getWaitTime(); break;
			case "TT": value = process.getTurnaroundTime(); break;
			case "RT": value = process.getResponseTime(); break;
		}

		return value;
	}

	


	var TextDisplay = {};


	TextDisplay.generateTextGanttChart = function(pids, logList){
		// Typechecking maybe?

		var processLines = {}, processLineActiveFlags = {}, 
			maxPidDigits = 0, pidPad = "",
			logsItr, log, id, waiting,
			time = 0, nextNewDigit = 10, oddNumDigits = true, leftPad = rightPad = " ",
			timeLine = "", ganttChartText = "",
			i, n;


		/*			Initialize			*/
		for(i = 0; i < pids.length; i++){
			processLines[pids[i]] = "";
			processLineActiveFlags[pids[i]] = false;
			
			// Findng max length of digits
			n = ('' + pids[i]).length;
			if(n > maxPidDigits){
				maxPidDigits = n;
			}
		}

		pidPad = fillString(" ", maxPidDigits + 1);
		timeLine = pidPad + " ";


		/*			Generate Process Lines			*/
		logsItr = logList.getIterator();
		while(logsItr.hasNext()){
			log = logsItr.getNext();

			if(time === nextNewDigit){
				if(oddNumDigits){
					leftPad += " ";
				}else{
					rightPad += " ";
				}

				oddNumDigits = !oddNumDigits;
				nextNewDigit *= 10;
			}

			// Place marks on active processes (running or waiting processes)
			if(log.running){
				id = log.running.process.id;

				// Note: "" converts to false
				if(processLines[id] || processLines[id] === ""){
					processLines[id] += leftPad + "R" + rightPad;
				}

				processLineActiveFlags[id] = true;
			}

			waiting = log.waiting;
			for(i = 0; i < waiting.length; i++){
				id = waiting[i].id;

				if(processLines[id] || processLines[id] === ""){
					processLines[id] += leftPad + "W" + rightPad;
				}

				processLineActiveFlags[id] = true;
			}


			// Places marks on non-active processes
			for(i = 0; i < pids.length; i++){
				id = pids[i];

				if(!processLineActiveFlags[id]){
					processLines[id] += leftPad + "-" + rightPad;
				}else{
					processLineActiveFlags[id] = false;
				}
			}

			timeLine += " " + (time++) + " ";
		}

		// Build Gantt Chart
		for(i = 0; i < pids.length; i++){
			id = pids[i];

			ganttChartText += padRight(id, pidPad) + "|" + processLines[id] + "\n";
		}

		
		ganttChartText += pidPad + " " + fillString("_", timeLine.length - pidPad.length) + "\n";
		ganttChartText += timeLine;


		return ganttChartText;
	}


	TextDisplay.generateTextProcessTable = function(processes){
		var columnPads = [], header, process, width, maxWidth, 
			hr = "+", dhr = "+", tableText = "",
			i, j;


		for(i = 0; i < headers.length; i++){
			header = headers[i];

			maxWidth = header.length;

			for(j = 0; j < processes.length; j++){
				width = ('' + getProcessData(header, processes[j].process)).length;

				if(width > maxWidth){
					maxWidth = width;
				}
			}

			columnPads[i] = fillString(" ", maxWidth + 4);
			hr += fillString("-", maxWidth + 5) + "+";
			//dhr += fillString("=", maxWidth + 5) + "+";
		}


		/*			Build Table			*/

		// Headers
		tableText += hr + "\n|";
		for(i = 0; i < headers.length; i++){
			tableText += " " + padRight(headers[i], columnPads[i]) + "|";
		}
		tableText += "\n" + hr + "\n";
		
		for(i = 0; i < processes.length; i++){
			process = processes[i].process;

			tableText += "|";
			for(j = 0; j < headers.length; j++){
				tableText += " " + padRight(getProcessData(headers[j], process), columnPads[j]) + "|";
			}
			tableText += "\n";
		}

		tableText += hr + "\n";


		return tableText;
	}



	// ============		String Manipulation Helper Functions	============ //
	function fillString(ch, length){
		var c, count, str;

		if(length === 0){
			return "";
		}

		c = ch;
		count = length / 2;
		str = c;

		while(str.length <= count){
			str += str;
		}

		return str + str.slice(0, length - str.length);
	}


	function padLeft(str, pad){
		return (pad + str).slice(-pad.length);
	}


	function padRight(str, pad){
		return (str + pad).slice(0, pad.length);
	}


	function sort(array){
		var i, j, min, swapIndex, temp;

		for(i = 0; i < array.length - 1; i++){
			min = array[i];
			swapIndex = -1;

			for(j = i + 1; j < array.length; j++){
				if(min > array[j]){
					min = array[j];
					swapIndex = j;
				}
			}

			// swap
			if(swapIndex > -1){
				temp = array[i];
				array[i] = array[swapIndex];
				array[swapIndex] = temp;
			}
		}

		return array;
	}



	global.CPUscheduling.TextDisplay = TextDisplay;
	/*		Helper Functions		*/



})(this);