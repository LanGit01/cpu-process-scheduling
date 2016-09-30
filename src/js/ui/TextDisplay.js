(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}



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


	global.CPUscheduling.TextDisplay = TextDisplay;
	/*		Helper Functions		*/



})(this);