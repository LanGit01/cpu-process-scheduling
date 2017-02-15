this.TestUtils = (function(){



	function generateLogTable(container, logs){
		var i, j, log, waiting,
			table, thead, tbody, tr, td,
			text;

		// Create Table
		table = document.createElement("table");
		container.appendChild(table);

		thead = table.createTHead();
		generateTableHeaders(thead, ["Time", "ID", "Remaining", "Waiting"]);

		for(i = 0; i < logs.length; i++){
			log = logs[i];

			tr = table.insertRow();
			tr.insertCell().appendChild(document.createTextNode(i));

			if(log.running){
				tr.insertCell().appendChild(document.createTextNode(log.running.id));
				tr.insertCell().appendChild(document.createTextNode(log.running.remainingTime));
			}else{
				td = tr.insertCell();
				td.colSpan = 2;
				td.appendChild(document.createTextNode("- none -"));
			}

			waiting = log.waiting;
			if(waiting.length === 0){
				tr.insertCell().appendChild(document.createTextNode("- none -"));
			}else{
				text = "[";
				for(j = 0; j < waiting.length; j++){
					text += waiting[j].id;

					if(j + 1 < waiting.length){
						text += ", ";
					}
				}
				text += "]";

				tr.insertCell().appendChild(document.createTextNode(text));					
			}

			
		}
	}

	function generateTableHeaders(thead, headers){
		var i, th;

		for(i = 0; i < headers.length; i++){
			th = document.createElement("th");
			th.appendChild(document.createTextNode(headers[i]));
			thead.appendChild(th);
		}
	}







	function generateProcessDataTable(container, processList){
		var row, process, tbody,
			tr;

		var table, thead, tr, td;

		table = document.createElement("table");
		container.appendChild(table);

		thead = table.createTHead();
		generateTableHeaders(thead, ["ID", "Burst Time", "Arrival Ttime", "Start Time", "End Time", "Wait Time", "Remaining Time", "Turnaround Time"]);

		for(row = 0; row < processList.length; row++){
			process = processList[row];

			tr = table.insertRow();
			tr.insertCell().appendChild(document.createTextNode(process.id));
			tr.insertCell().appendChild(document.createTextNode(process.burstTime));
			tr.insertCell().appendChild(document.createTextNode(process.arrivalTime));
			tr.insertCell().appendChild(document.createTextNode(process.startTime));
			tr.insertCell().appendChild(document.createTextNode(process.endTime));
			tr.insertCell().appendChild(document.createTextNode(process.getWaitTime()));
			tr.insertCell().appendChild(document.createTextNode(process.getResponseTime()));
			tr.insertCell().appendChild(document.createTextNode(process.getTurnaroundTime()));
		}
	}



	return {
		generateLogTable: generateLogTable,
		generateProcessDataTable: generateProcessDataTable
	};

})();