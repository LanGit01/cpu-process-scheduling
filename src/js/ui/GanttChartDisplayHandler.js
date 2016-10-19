(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var DEFAULT_FPS = 12,
		BASE_VELOCITY = 1,
		ADD_VELOCITY = 2,
		VELOCITY_MULTIPLIER = 1.15,
		MAX_ADD_VELOCITY = 20,		// Limit on additional velocity
		TIME_TO_ACCEL = 400,		// Time before acceleration kicks in

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
		this._x = 0;
		this._y = 0;
		this._addVelocity = ADD_VELOCITY;
		this._bounds = ganttChartUI.getBounds();

		// Timing
		this._fps = fps || DEFAULT_FPS;
		this._timePerFrame = Math.floor(1000 / this._fps);
		this._lastTime = 0;

		// Acceleration
		this._lastDirection = null;
		this._timeKeyHeld = 0;
	}


	GanttChartDisplayHandler.prototype.move = function(direction){
		var vx, vy, velocity, newPosition, now = Date.now();

		if(now < (this._lastTime + this._timePerFrame)){
			return;
		}

		// Acceleration
		velocity = this._addVelocity;

		if(this._lastDirection === direction){
			this._timeKeyHeld += (now - this._lastTime);

			if(this._timeKeyHeld > TIME_TO_ACCEL){
				velocity *= VELOCITY_MULTIPLIER;

				if(velocity > MAX_ADD_VELOCITY){
					velocity = MAX_ADD_VELOCITY;
				}
			}
		}else{
			this._timeKeyHeld = 0;
			velocity = ADD_VELOCITY;
		}

		this._lastDirection = direction;
		this._addVelocity = velocity;

		velocity += BASE_VELOCITY;

		// Determine new position
		this.calculateNewPosition(direction, velocity);

		vx = ~~(this._x);
		vy = ~~(this._y);

		//console.log(velocity);

		this._ganttChartUI.setPosition(vx, vy);
		
		// Redraw
		this._ganttChartUI.draw();
		
		//console.log(now - this._lastTime);
		
		this._lastTime = now;

		return true;
	}


	GanttChartDisplayHandler.prototype.calculateNewPosition = function(direction, velocity){
		var x = this._x, y = this._y,
			bounds = this._bounds;

		switch(direction){
			case LEFT:	x -= velocity; break;
			case UP:	y -= velocity; break;
			case RIGHT:	x += velocity; break;
			case DOWN: 	y += velocity; break;
			default: return null;
		}

		if(x < bounds.x){
			x = bounds.x;
		}else
		if(x > bounds.x + bounds.w - 1){
			x = bounds.x + bounds.w - 1;
		}

		if(y < bounds.y){
			y = bounds.y
		}else
		if(y > bounds.y + bounds.h - 1){
			y = bounds.y + bounds.h - 1;
		}

		this._x = x;
		this._y = y;

	}


	GanttChartDisplayHandler.prototype.initialize = function(){
		var that = this, target = this._ganttChartUI.getCanvas(),
			position = this._ganttChartUI.getPosition();

		target.tabIndex = 0;

		// Set initial position
		this._x = position.x;
		this._y = position.y;

		target.addEventListener("keydown", function(e){
			if(KeyToDirectionMap[e.key]){
				that.move(KeyToDirectionMap[e.key]);
				e.preventDefault();
			}else{
				that._lastDirection = null;
				that._timeKeyHeld = 0;
			}
		});

		target.addEventListener("keyup", function(e){
			that._lastDirection = null;
			that._timeKeyHeld = 0;
		});
	}



	global.CPUscheduling.GanttChartDisplayHandler = GanttChartDisplayHandler;

})(this);