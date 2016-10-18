(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var DEFAULT_FPS = 12,
		DEFAULT_VELOCITY = 2,
		DEFAULT_VELOCITY_MULTIPLIER = 3

		LEFT = 1,
		UP = 2,
		RIGHT = 3,
		DOWN = 4;


	var KeyToDirectionMap = {
		"ArrowLeft": LEFT,
		"ArrowUp": UP,
		"ArrowRight": RIGHT,
		"ArrowDown": DOWN
	};

	function GanttChartDisplayHandler(ganttChartUI, fps){
		this._ganttChartUI = ganttChartUI;

		// Movement
		this._velocity = DEFAULT_VELOCITY;

		// Timing
		this._fps = fps || DEFAULT_FPS;
		this._timePerFrame = Math.floor(1000 / this._fps);
		this._lastTime = 0;
	}


	GanttChartDisplayHandler.prototype.move = function(direction){
		var dx = dy = 0, position, now = Date.now();

		if(now < (this._lastTime + this._timePerFrame)){
			return;
		}

		switch(direction){
			case LEFT:	dx = -this._velocity; break;
			case UP:	dy = -this._velocity; break;
			case RIGHT:	dx = this._velocity; break;
			case DOWN: 	dy = this._velocity; break;
			default: return false;
		}

		position = this._ganttChartUI.getPosition();
		this._ganttChartUI.setPosition(position.x + dx, position.y + dy);
		
		// Redraw
		this._ganttChartUI.draw();
		
		//console.log(now - this._lastTime);
		
		this._lastTime = now;

		return true;
	}


	GanttChartDisplayHandler.prototype.initialize = function(){
		var that = this, target = this._ganttChartUI.getCanvas();

		target.tabIndex = 0;

		target.addEventListener("keydown", function(e){
			if(KeyToDirectionMap[e.key]){
				that.move(KeyToDirectionMap[e.key]);
				e.preventDefault();
			}
		});

		target.addEventListener("keyup", function(e){
			console.log("keyup");
		});

	}


	global.CPUscheduling.GanttChartDisplayHandler = GanttChartDisplayHandler;

})(this);