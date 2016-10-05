(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}


	var headers = [
		["PID", "id"],
		["BT", "burstTime"],
		["AT", "arrivalTime"],
		["Priority", "priority"],
		["ST", "startTime"],
		["WT", "waitTime"],
		["TT", "turnaroundTime"],
		["RT", "responseTime"],
		["ET", "endTime"],
	];

	var TEXT_NONE = "none";


	var TextDisplay = {};


	TextDisplay.generateTextGanttChart = function(pids, logList){
		// Typechecking maybe?

		var processHistories = {},
			pHistoryWrittenFlags = {},
			logsItr = logList.getIterator(),
			log, i, running, waiting, id, 
			time = 0, nextDigit = 10,
			leftPad = " ", rightPad = " ", oddFlag = true,
			hrUnit = "___", hr = "", timeText = "", chartText = "";


		pids = sort(pids);
		// Populate
		for(i = 0; i < pids.length; i++){
			processHistories[pids[i]] = "";
			pHistoryWrittenFlags[pids[i]] = false;
		}


		while(logsItr.hasNext()){
			// For counting padding
			if(time === nextDigit){
				if(oddFlag){
					leftPad += " ";
				}else{
					rightPad += " ";
				}

				hrUnit += "_";

				oddFlag = !oddFlag;
				nextDigit *= 10;
			}

			log = logsItr.getNext();

			// Running process
			running = log.running;
			if(running){
				id = running.id;

				if(processHistories[id] || processHistories[id] === ""){
					processHistories[id] += leftPad + "R" + rightPad;
				}

				pHistoryWrittenFlags[id] = true;
			}

			// Waiting processes
			waiting = log.waiting;
			for(i = 0; i < waiting.length; i++){
				id = waiting[i].id;

				if(processHistories[id] || processHistories[id] === ""){
					processHistories[id] += leftPad + "W" + rightPad;
				}

				pHistoryWrittenFlags[id] = true;
			}

			// Else
			for(i = 0; i < pids.length; i++){
				id = pids[i];

				if(!pHistoryWrittenFlags[id]){
					processHistories[id] += leftPad + "-" + rightPad;
				}else{
					pHistoryWrittenFlags[id] = false;
				}
			}

			hr += hrUnit;

			timeText += " " + (time++) + " ";
			
		}


		// Build chart
		//chartText = "  " + hr + "\n";
		for(i = 0; i < pids.length; i++){
			chartText += pids[i] + " |" + processHistories[pids[i]] + "\n";
		}
		chartText += "   " + hr + "\n";
		chartText += "   " + timeText;

		return chartText;
	}


	TextDisplay.generateTextProcessTable = function(processes){
		var i, j, header,
			tableMatrix = [], tableColumn,
			maxLength, process, value, temp, numRows, numCols,
			pItr, hLength = headers.length,
			columnSpaces = [], maxColLengths = [];
			hr = "", tableText = "";


		hr = "+";
		for(i = 0; i < hLength; i++){
			header = headers[i];
			maxLength = header[0].length;

			tableColumn = [];
			tableColumn[0] = header[0];

			pItr = processes.getIterator();
			while(pItr.hasNext()){
				value = pItr.getNext()[header[1]];

				if((!value && value !== 0) || value === -1){
					value = TEXT_NONE;
				}else{
					value = value.toString();
				}


				if(value.length > maxLength){
					maxLength = value.length;
				}

				tableColumn[tableColumn.length] = value;
			}

			tableMatrix[i] = tableColumn;
			maxColLengths[i] = maxLength;

			temp = "";
			for(j = 0; j < maxLength; j++){
				temp += " ";
				hr += "-";
			}
			columnSpaces[i] = temp;
			hr += "----+";
		}

		// Create Table
		numRows = tableMatrix[0].length;
		numCols = tableMatrix.length;
		for(i = 0; i < numRows; i++){
			tableText += hr + "\n|";

			for(j = 0; j < numCols; j++){
				tableText += "  " + (columnSpaces[j] + tableMatrix[j][i]).slice(-maxColLengths[j]) + "  |";
			}

			tableText += "\n";
		}

		tableText += hr;


		return tableText;
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