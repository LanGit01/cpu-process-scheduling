(function(global){


	var LEFT = 1,
		UP = 2,
		RIGHT = 3,
		DOWN = 4,

		BASE_VELOCITY = 1,
		ADD_VELOCITY = 2,
		VELOCITY_MULTIPLIER = 1.1,

		DEFAULT_FPS = 12;


	var KeyToDirection = {
		"ArrowLeft": LEFT,
		"ArrowUp": UP,
		"ArrowRight": RIGHT,
		"ArrowDown": DOWN
	};


	function GanttChartUIControl(ganttChart, fps){
		this._ganttChart = ganttChart;
		this._movementBounds = ganttChart.getPositionBoundsRect();

		// Timing
		this._fps = fps || DEFAULT_FPS;
		this._timePerFrame = Math.floor(1000 / this._fps);
		this._lastTime = 0;
	}



	GanttChartUIControl.prototype.initialize = function(){
		var mainCanvas = this._ganttChart.getCanvas();

		// Make canvas selectable
		mainCanvas.tabIndex = 0;

		mainCanvas.addEventListener("keydown", function(e){
			console.log(e.key);
		});

		mainCanvas.addEventListener("keyup", function(e){
			console.log(e.key);
		});


	}


	global.CPUscheduling.GanttChartUIControl = GanttChartUIControl;

})(this);