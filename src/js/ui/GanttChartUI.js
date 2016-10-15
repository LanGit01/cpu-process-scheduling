(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}


	var DEFAULT_MARK_WIDTH = 24,
		DEFAULT_MARK_HEIGHT = 24,

		DEFAULT_VIEW_WIDTH = 800,
		DEFAULT_VIEW_HEIGHT = 400,

		DEFAULT_RUNNING_COLOR,
		DEFAULT_WAITING_COLOR,

		DEFAULT_FONT_SIZE = 12,
		DEFAULT_FONT = "sans-serif",

		LABEL_MARGIN = 10,
		CELL_BORDER = 1,
		DEFAULT_BORDER_COLOR = "#555555";



	function GanttChartUI(pids, logs){
		var i, itr;

		// Labels and Data
		this._pids = pids;
		this._rowMapping = {};
		this._logs = [];

		/*			Areas			*/
		this._labelArea = null;
		this._chartArea = null;
		this._timelineArea = null;


		/*			Positioning			*/
		// values are relative to chart area
		this._x = 0;
		this._y = 0;
		this._drawLine = 0;

		/*			Canvas Display		*/
		
		// Canvas
		this._view = null;
		this._buffer = null;
		this._viewWidth = 0;
		this._viewHeight = 0;
		
		//	Display
		this._displayConfig = {};
		this._displayInitialized = false;
		this._visible = false;


		// Map PIDs to logs
		for(i = 0; i < pids.length; i++){
			this._rowMapping[pids[i]] = i;
		}

		// Convert logs from linked list to array
		itr = logs.getIterator();
		while(itr.hasNext()){
			this._logs[this._logs.length] = itr.getNext();
		}

	}


	GanttChartUI.prototype.initDisplay = function(options){
		var chartWidth = chartHeight = 0,
			config, i, n, maxLabelWidth, ctx;

		this._x = this._y = 0;

		config = createDisplayConfig(options, this._pids.length);
		this._displayConfig = config;

		// Create view canvas and buffer canvas
		this._view = createCanvasObject(config.viewWidth, config.viewHeight);
		this._buffer = createCanvasObject(config.viewWidth, config.viewHeight);

		// Initialize context
		ctx = this._buffer.context;
		ctx.font = DEFAULT_FONT_SIZE + "px " + DEFAULT_FONT;
		ctx.textBaseline = "middle";

		
		/*			Calculate Areas			*/
		maxLabelWidth = 0;
		for(i = 0; i < this._pids.length; i++){
			n = ctx.measureText("P" + this._pids[this._pids.length - 1]).width;

			if(n > maxLabelWidth){
				maxLabelWidth = n;
			}
		}
		
		this._labelArea = createRect(0, 0, maxLabelWidth + (LABEL_MARGIN * 2), config.viewHeight);
		this._timelineArea = createRect(this._labelArea.w, config.viewHeight - config.markHeight, config.viewWidth - this._labelArea.w, config.markHeight);
		this._chartArea = createRect(this._labelArea.w, 0, this._timelineArea.w, config.viewHeight - config.markHeight);
		
		this._drawLine = this._chartArea.w;

		this._displayInitialized = true;

		return this._view.canvas;
	}


	GanttChartUI.prototype.flipChart = function(){
		var x = this._chartArea.x, y = this._chartArea.y,
			w = this._chartArea.w, h = this._chartArea.h;

		this._view.context.drawImage(this._buffer.canvas, x, y, w, h, x, y, w, h);
	}


	GanttChartUI.prototype.drawChart = function(){
		var cvWidth = this._chartArea.w - (CELL_BORDER * 2),			// chart dimensions without border
			cvHeight = this._chartArea.h - (CELL_BORDER * 2),
			x = this._x,
			y = this._y,
			xEnd = x + cvWidth - 1,
			yEnd = y + cvHeight - 1,
			cellWidth = this._displayConfig.markWidth + CELL_BORDER,
			cellHeight = this._displayConfig.markHeight + CELL_BORDER,
			ctx = this._buffer.context,
			colOffset, colEnd, rowOffset, rowEnd,
			xMarkStart, yMarkStart;

			/*		Calculate ranges and positions 		*/
			if(xEnd > this._drawLine){
				xEnd = this._drawLine;
			}

			colOffset = ~~(x / cellWidth);
			colEnd = ~~(xEnd / cellWidth);
			rowOffset = ~~(y / cellHeight);
			rowEnd = ~~(yEnd / cellHeight);

			xMarkStart = -(x % cellWidth);
			yMarkStart = -(y % cellHeight);

			ctx.clearRect(this._chartArea.x, this._chartArea.y, this._chartArea.w, this._chartArea.h);
			/*		Draw Grid		*/
			drawGrid(ctx, this._chartArea.x, this._chartArea.y, xMarkStart + cellWidth, yMarkStart + cellHeight, cellWidth, cellHeight, this._chartArea.w, this._chartArea.h);



			this.flipChart();
	}


	/*			Helper Functions		*/
	function createRect(x, y, w, h){
		return{
			x: x,
			y: y,
			w: w,
			h: h
		};
	}

	/*
	 * Config Options:
	 *	- process mark dimensions
	 *	- view dimensions
	 *	- running and waiting process colors
	 */
	function createDisplayConfig(options, rows){
		var config = {};
		// ((d.markHeight + CELL_SPACING) * that._pids.length + CELL_SPACING + DEFAULT_TIMELINE_HEIGHT);
		if(typeof options === "object"){
			config.markWidth = options.markWidth || DEFAULT_MARK_WIDTH;
			config.markHeight = options.markHeight || DEFAULT_VIEW_HEIGHT;

			config.viewWidth = options.viewWidth || DEFAULT_VIEW_WIDTH;
			config.viewHeight = options.viewHeight || ((config.markHeight + CELL_BORDER) * rows) + CELL_BORDER + config.markHeight;

			config.runningColor = options.runningColor || DEFAULT_RUNNING_COLOR;
			config.waitingColor = options.waitingColor || DEFAULT_WAITING_COLOR;
		}else{
			config.markWidth = DEFAULT_MARK_WIDTH;
			config.markHeight = DEFAULT_MARK_HEIGHT;

			config.viewWidth = DEFAULT_VIEW_WIDTH;
			config.viewHeight = ((config.markHeight + CELL_BORDER) * rows) + CELL_BORDER + config.markHeight;

			config.runningColor = DEFAULT_RUNNING_COLOR;
			config.waitingColor = DEFAULT_WAITING_COLOR;
		}

		return config;	
	}


	function createCanvasObject(width, height){
		var canvas, context;

		canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		context = canvas.getContext("2d");

		return {
			canvas: canvas,
			context: context
		};
	}


	function drawGrid(ctx, cx, cy, startx, starty, cellWidth, cellHeight, gridWidth, gridHeight){
		var x = startx + 0.5, y = starty + 0.5,
			i;


		ctx.strokeStyle = DEFAULT_BORDER_COLOR;
		// Draw grid borders
		ctx.strokeRect(cx + 0.5, cy + 0.5, gridWidth - 1, gridHeight - 1);

		x += cx;
		y += cy;
		gridWidth += cx;
		gridHeight += cy;

		ctx.beginPath();
		while(x < gridWidth){
			ctx.moveTo(x, cy);
			ctx.lineTo(x, cy + gridHeight - 1);
			x += cellWidth;
		}

		while(y < gridHeight){
			ctx.moveTo(cx, y);
			ctx.lineTo(cx + gridWidth - 1, y);
			y += cellHeight;
		}


		ctx.closePath();
		ctx.stroke();

	}


	function drawMark(){

	}


	global.CPUscheduling.GanttChartUI = GanttChartUI;


})(this);