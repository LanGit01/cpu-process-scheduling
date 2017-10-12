define(["Gui/GanttChart"], function(GanttChart){

	function GanttChartGUI(container, options){
		this._container = container;
		this._options = options;

		this._listeners = {};
		this._ganttChart = null;
	}

	/*
	GanttChartGUI.CHART_GRID = GanttChart.CHART_GRID;
	GanttChartGUI.ROW_LABELS = GanttChart.ROW_LABELS;
	GanttChartGUI.COL_LABELS = GanttChart.COL_LABELS;
	*/

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

		addMouseListener: function(componentId, eventType, fn){
			// Checks
			var elem, hasListener, listenerMapItem;

			if(typeof fn !== "function") return; // Throw error

			if(!this._listeners[eventType]){
				this._listeners[eventType] = [];
			}

			hasListener = this._listeners[eventType].some(function(item){
				return item.orig == fn;
			});

			if(hasListener) return false;

			elem = this._ganttChart.getCanvas();

			listenerMapItem = {
				orig: fn,
				wrapped: createMouseHandler(
					getClientRect.bind(elem),
					createGetComponentRect(componentId).bind(this._ganttChart),
					fn
				)
			};

			elem.addEventListener(eventType, listenerMapItem.wrapped);
			this._listeners[eventType].push(listenerMapItem);
			return true;
		},


		removeMouseListener: function(componentId, eventType, fn){

		},

		addKeyboardListener: function(eventType, fn){

		}
	};






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