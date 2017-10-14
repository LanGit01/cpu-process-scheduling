define(["Gui/GanttChart"], function(GanttChart){

	var MOUSE_EVENTS = ["mousemove", "mousedown", "mouseup", "click", "dblclick", "wheel"],
		KEYBOARD_EVENTS = ["keydown", "keypress", "keyup"];

	var DEFAULT_TICKS_PER_SECOND = 20;



	function GanttChartGUI(container, options){
		this._container = container;
		this._options = options;

		this._controls = [];
		this._listeners = {};
		this._ganttChart = null;

		this._runEventThrottler(DEFAULT_TICKS_PER_SECOND);
	}


	GanttChartGUI.prototype = {
		constructor: constructor,

		newChart: function(chartData){
			// Remove existing canvas first, wherever it is
			var oldCanvas = this._ganttChart && this._ganttChart.getCanvas();
			if(oldCanvas !== null && oldCanvas.parentNode !== null){
				oldCanvas.parentNode.removeChild(oldCanvas);
			}

			// Append new canvas
			this._ganttChart = new GanttChart(chartData, this._options);
			this._container.appendChild(this._ganttChart.getCanvas());
			this._ganttChart.draw();
		},

		reflow: function(){
			
		},

		addEventListener: function(componentId, eventType, fn){
			var elem, isMouseEvent, listenerMapItem;

			// Validation
			if(typeof fn !== "function") throw new TypeError("argument 'fn' is not a function");

			isMouseEvent = (MOUSE_EVENTS.indexOf(eventType) !== -1);

			if(!isMouseEvent && KEYBOARD_EVENTS.indexOf(eventType) === -1){
				throw new Error("'" + eventType + "' is not supported");
			}else{
				if(!this._listeners[eventType]){
					this._listeners[eventType] = [];
				}else
				if(this._listeners[eventType].some(listenerItemCompare(fn))){
					return false;
				}

				elem = this._ganttChart.getCanvas();
				listenerMapItem = {
					orig: fn
				};

				if(isMouseEvent){
					listenerMapItem.wrapped = createMouseHandler(
						getClientRect.bind(elem),
						createGetComponentRect(componentId).bind(this._ganttChart),
						fn
					);
				}

				elem.addEventListener(eventType, listenerMapItem.wrapped || listenerMapItem.orig);
				this._listeners[eventType].push(listenerMapItem);
			}

			return true;
		},

		removeEventListener: function(componentId, eventType, fn){
			var index, listeners;

			if(typeof fn !== "function" || this._listeners[eventType] === null) return;

			listeners = this._listeners[eventType];
			index = listeners.findIndex(listenerItemCompare(fn));
			
			if(index !== -1){
				fn = listeners[index].wrapped || fn;
				this._ganttChart.getCanvas().removeEventListener(eventType, fn);
				listeners.splice(index, 1);
			}
		},

		addControl: function(control){
			// Validate
			if(typeof control !== "object" || typeof control.setup !== "function" || 
			   typeof control.cleanup !== "function" || typeof control.update !== "function"){
				throw new Error("Invalid argument: does not conform to api");
			}

			if(this._controls.indexOf(control) === -1){
				this._controls.push(control);
				control.setup(this.addEventListener.bind(this));
				return true;
			}

			return false;
		},

		removeControl: function(control){
			var control,
				index = this._controls.indexOf(control);

			if(index !== -1){
				this._controls.splice(index, 1);
				control.cleanup(this.removeEventListener.bind(this));
			}
		},

		stop: function(){
			this._stopEventThrottler();
		},

		_runEventThrottler: function(ticksPerSecond){
			var timePerFrame = 1000 / ticksPerSecond,
				lastTime = 0, tickFunc;

			tickFunc = (function tick(timestamp){
				if(lastTime + timePerFrame < timestamp){
					for(var i = 0; i < this._controls.length; i++){
						this._controls[i].update(this._ganttChart);
						this._ganttChart.draw();
					}
					lastTime = timestamp;
				}

				this._rafHandle = requestAnimationFrame(tickFunc);
			}).bind(this);

			this._rafHandle = requestAnimationFrame(tickFunc);
		},

		_stopEventThrottler: function(){
			if(this._rafHandle){
				cancelAnimationFrame(this._rafHandle);
			}
		}
	};



	function listenerItemCompare(fn){
		return function(item){
			return item.orig === fn;
		}
	}


	function getClientRect(){
		return this.getBoundingClientRect();
	}


	function createGetComponentRect(componentId){
		return function(){
			return this.getComponentRect(componentId) || null;
		}
	}


	function createMouseHandler(getClientRect, getComponentRect, fn){
		return function(e){
			var clientRect = getClientRect(),
				componentRect = getComponentRect(),
				x = e.clientX - clientRect.left,
				y = e.clientY - clientRect.top;

			if(componentRect === null){
				fn(x, y);
			}else
			if(componentRect.pointInRect(x, y)){
				fn(x - componentRect.x, y - componentRect.y);
			}
		}
	}


	return GanttChartGUI;
});