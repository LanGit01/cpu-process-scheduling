(function(global){
	
	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}



	var TextDisplay = {};


	TextDisplay.generateTextGanttChart = function(pids, logList){
		// Typechecking maybe?

		var processHistory = {},
			pHistoryWrittenFlags = {},
			logsItr = logList.getIterator(),
			log, i, running, waiting, id,
			time = 0, 
			hr = "", timeText = "  ", tempText, chartText;


		for(i = 0; i < pids.length; i++){
			processHistory[pids[i]] = "";
			pHistoryWrittenFlags[pids[i]] = false;
		}

		while(logsItr.hasNext()){
			log = logsItr.getNext();

			running = log.running;
			if(running){
				id = running.id;
				
				if(processHistory[id] || processHistory[id] === ""){
					processHistory[id] += " R ";
				}

				pHistoryWrittenFlags[id] = true;
			}
			

			waiting = log.waiting;
			for(i = 0; i < waiting.length; i++){
				id = waiting[i].id;

				if(processHistory[id] || processHistory[id] === ""){
					processHistory[id] += " W ";
				}

				pHistoryWrittenFlags[id] = true;
			}


			for(i = 0; i < pids.length; i++){
				id = pids[i];

				if(!pHistoryWrittenFlags[id]){
					processHistory[id] += " - ";
				}else{
					pHistoryWrittenFlags[id] = false;
				}
			}


			hr += "___";

			tempText = " " + (time++) + " ";
			timeText += tempText.substring(tempText.length - 3);
		}

		// Build chart
		//chartText = "  " + hr + "\n";
		chartText = "";
		for(i = 0; i < pids.length; i++){
			chartText += pids[i] + " |" + processHistory[pids[i]] + "\n";
		}
		chartText += "  |" + hr + "\n";
		chartText += timeText;

		return chartText;
	}


	/*
		




	*/


	global.CPUscheduling.TextDisplay = TextDisplay;
	/*		Helper Functions		*/



})(this);