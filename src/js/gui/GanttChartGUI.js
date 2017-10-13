define(["Gui/GanttChart"], function(GanttChart){

	var MOUSE_EVENTS = ["mousemove", "mousedown", "mouseup", "click", "dblclick", "wheel"],
		KEYBOARD_EVENTS = ["keydown", "keypress", "keyup"];


	function GanttChartGUI(container, options){
		this._container = container;
		this._options = options;

		this._listeners = {};
		this._ganttChart = null;
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


		removeMouseListener: function(componentId, eventType, fn){
			var index;

			if(typeof fn !== "function" || this._listeners[eventType] === null) return;

			index = this._listeners[eventType].findIndex(listenerItemCompare(fn));
			if(index !== -1){
				this._ganttChart.getCanvas().removeEventListener(eventType, this._listeners[eventType][index].wrapped);
				this._listeners[eventType].splice(index, 1);
			}
		},

		addKeyboardListener: function(eventType, fn){

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