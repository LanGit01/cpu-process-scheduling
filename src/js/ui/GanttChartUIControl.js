(function(global){


	var LEFT = 1,
		UP = 2,
		RIGHT = 3,
		DOWN = 4,

		BASE_SPEED = 1,
		ADD_SPEED = 2,
		SPEED_MULTIPLIER = 1.1,
		MAX_SPEED = 20,
		ACCEL_TIME_TRESHOLD = 1000,

		DEFAULT_MOVE_UPDATE_DELAY = 100;


	var KeyToDirection = {
		"ArrowLeft": LEFT,
		"ArrowUp": UP,
		"ArrowRight": RIGHT,
		"ArrowDown": DOWN
	};


	function GanttChartUIControl(ganttChart, moveUpdateDelay){
		this._ganttChart = ganttChart;
		// Movement
		this._x;
		this._y;

		this._xMin;
		this._yMin;
		this._xMax;
		this._yMax;

		this._currentSpeed = BASE_SPEED;
		this._addSpeed = ADD_SPEED;

		// Timing
		this._moveUpdateDelay = moveUpdateDelay || DEFAULT_MOVE_UPDATE_DELAY;
		this._lastTime = Date.now();

		// Keypress and direction
		this._pressedDirection = null;
		this._timeKeyDown = 0;
	}


	function move(that, direction){
		var now = Date.now(), speed = that._currentSpeed;

		if(now < that._lastTime + that._timePerFrame){
			return;
		}

		that._lastTime = now;
	}





	function onKeyDown(e){
		// Should be bounded to a GanttChartUIControl instance
		var direction = KeyToDirection[e.key], now;

		// Ignore keypress if not a direction key
		if(direction){
			now = Date.now();

			// Register the time a new direction was pressed
			if(direction !== this._pressedDirection){
				this._pressedDirection = direction;
				this._timeKeyDown = now;
			}

			if(now > this._lastTime + this._moveUpdateDelay){
				console.log(now - this._lastTime);
				this._lastTime = now;

				// Insert update code here
			}

			e.preventDefault();
		}
	}


	function onKeyup(e){
		this._pressedDirection = null;
	}


	GanttChartUIControl.prototype.initialize = function(){
		var mainCanvas = this._ganttChart.getCanvas(),
			bounds = this._ganttChart.getPositionBoundsRect(),
			keyDownFunc, keyUpFunc;

		// Bounds
		this._xMin = bounds.x;
		this._xMax = bounds.x + bounds.w;
		this._yMin = bounds.y;
		this._yMax = bounds.y + bounds.h;

		// Make canvas selectable
		mainCanvas.tabIndex = 0;

		mainCanvas.addEventListener("keydown", onKeyDown.bind(this));

		mainCanvas.addEventListener("keyup", onKeyup.bind(this));


	}


	global.CPUscheduling.GanttChartUIControl = GanttChartUIControl;

})(this);