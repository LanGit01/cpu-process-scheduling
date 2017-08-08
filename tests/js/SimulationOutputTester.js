/**
 *	TestUtils is a set of tools meant only for testing	
 */
define(function(){

	function generateLogTable(logs){
		var table = document.createElement("table");

		generateTableHeaders(table.createTHead(), ["Time", "ID", "Remaining", "Waiting"]);

		logs.forEach(function(log, i){
			var tr = table.insertRow(), td, waiting;
			
			createCell(tr, i + 1);

			if(log.running){
				createCell(tr, log.running.id);
				createCell(tr, log.running.remainingTime);
			}else{
				td = createCell(tr, "- none -");
				td.colSpan = 2;
			}

			waiting = log.waiting;
			if(waiting.length === 0){
				createCell(tr, "- none -");
			}else{
				createCell(tr, "[" + implode(waiting.map(function(val){
					return val.id;
				}), ", ") + "]");

			}
		});

		return table;
	}

	function generateProcessDataTable(processList){
		var table = document.createElement("table");

		generateTableHeaders(table.createTHead(), ["ID", "Burst Time", "Arrival Ttime", "Start Time", "End Time", "Wait Time", "Remaining Time", "Turnaround Time"]);

		processList.forEach(function(process){
			var tr = table.insertRow();
			createCell(tr, process.id);
			createCell(tr, process.burstTime);
			createCell(tr, process.arrivalTime);
			createCell(tr, process.startTime);
			createCell(tr, process.endTime);
			createCell(tr, process.getWaitTime());
			createCell(tr, process.getResponseTime());
			createCell(tr, process.getTurnaroundTime());
		});

		return table;
	}

	function generateTableHeaders(thead, headers){
		var i, th;

		for(i = 0; i < headers.length; i++){
			th = document.createElement("th");
			th.appendChild(document.createTextNode(headers[i]));
			thead.appendChild(th);
		}
	}

	function implode(arr, ch){
		var str = "";

		for(var i = 0; i < arr.length - 1; i++){
			str += arr[i] + ch;
		}

		str += arr[arr.length - 1];
		return str;
	}


	function createCell(tr, text){
		var td = tr.insertCell();

		if(text || text === 0){
			td.appendChild(document.createTextNode(text));
		}

		return td;
	}



	return {
		generateLogTable: generateLogTable,
		generateProcessDataTable: generateProcessDataTable
	};

});