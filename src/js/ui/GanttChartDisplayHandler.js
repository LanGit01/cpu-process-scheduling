(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	function GanttChartDisplayHandler(ganttChartUI){
		this._ganttChartUI = ganttChartUI;

	}



	global.CPUscheduler.GanttChartDisplayHandler = GanttChartDisplayHandler;

})(this);