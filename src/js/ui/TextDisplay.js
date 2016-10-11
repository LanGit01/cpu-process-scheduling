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
				id = log.running.id;

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
		/*var processHistories = {},
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
		*/
	}



	TextDisplay.generateTextProcessTable = function(processes){
		var headers = ["PID", "BT", "AT", "ST", "ET", "TT", "RT", "WT"];

		var i, j,
			tableMatrix = [], columnWidths = [], columnPadding = [],
			column,	pItr, process,
			maxWidth, rowData, cellData,
			tempText, hrSingle, hrDouble,
			tableText, rowText, strlen,
			rows, cols;


		// Build table matrix
		for(i = 0; i < headers.length; i++){
			column = [];
			column[0] = headers[i];
			columnWidths[i] = headers[i].length;
			tableMatrix[i] = column;
		}


		
		for(i = 0; i < processes.length; i++){	
			process = processes[i];

			rowData = [process.id, process.burstTime, process.arrivalTime, process.startTime, process.endTime,
					   process.getTurnaroundTime(), process.getResponseTime(), process.getWaitTime()];
			for(j = 0; j < rowData.length; j++){
				cellData = rowData[j];

				if(cellData > -1){
					cellData = cellData.toString();
				}else{
					cellData = TEXT_NONE;
				}

				if(cellData.length > columnWidths[j]){
					columnWidths[j] = cellData.length;
				}

				tableMatrix[j][i + 1] = cellData;
			}

		}

		// create sting padding and templates
		hrSingle = "+";
		hrDouble = "+";
		for(i = 0; i < columnWidths.length; i++){
			tempText = "";
			
			strlen = columnWidths[i];
			for(j = 0; j < strlen; j++){
				tempText += " ";
				hrSingle += "-";
				hrDouble += "=";
			}

			hrSingle += "----+";
			hrDouble += "====+";

			columnPadding[i] = tempText;
		}


		// Create table text
		tableText = hrDouble + "\n";

		rows = tableMatrix[0].length;
		cols = tableMatrix.length;
		for(i = 0; i < rows; i++){
			rowText = "|";

			for(j = 0; j < cols; j++){
				rowText += "  " + (tableMatrix[j][i] + columnPadding[j]).slice(0, columnWidths[j]) + "  |";
			}

			if(i === 0){
				tableText += rowText + "\n" + hrDouble + "\n";
			}else{
				tableText += rowText + "\n" + hrSingle + "\n";
			}
		}

		return tableText;


		/*var i, j, header,
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
		*/
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