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

		DEFAULT_RUNNING_COLOR = "#333333",
		DEFAULT_WAITING_COLOR = "#aaaaaa",
		DEFAULT_BG_COLOR = "#ffffff",

		DEFAULT_FONT_SIZE = 12,
		DEFAULT_FONT = "sans-serif",
		DEFAULT_FONT_COLOR = "#000000",

		LABEL_MARGIN = 10,
		CELL_BORDER = 1,
		DEFAULT_BORDER_COLOR = "#555555";


	/**
	 * A Graphical User Interface for displaying the gantt chart of a scheduling algorithm simulation
	 */
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

		this._colOffset = 0;
		this._colEnd = 0;
		this._rowOffset = 0;
		this._rowEnd = 0;
		this._xDrawEnd = 0;
		this._yDrawEnd = 0;

		/*			Canvas Display		*/
		
		// Canvas
		this._view = null;
		this._buffer = null;
		this._viewWidth = 0;
		this._viewHeight = 0;

		this._boundaryRect = null;
		
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

	/**
	 *	Creates and initializes the display. This must be called first after creating an instance.
	 * 
	 *	The `options` argument and it's properties are optional. Default values will be used if values are not
	 *	provided.
	 *
	 *	@param options.markWidth - width of the mark of a process
	 *	@param options.markHeight - height of the mark of a process
	 *	@param options.viewWidth - width of the canvas display
	 *	@param options.viewHeight - height of the canvas display
	 *	@param options.runningColor - color of the mark of a running process
	 *	@param options.waitingColor -  color of the mark of a waiting process
	 *	
	 */
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
		
		this._labelViewArea = createRect(0, 0, maxLabelWidth + (LABEL_MARGIN * 2), config.viewHeight);
		this._timelineViewArea = createRect(this._labelViewArea.w, config.viewHeight - config.markHeight - CELL_BORDER, config.viewWidth - this._labelViewArea.w, config.markHeight + CELL_BORDER);
		this._chartViewArea = createRect(this._labelViewArea.w, 0, this._timelineViewArea.w, config.viewHeight - config.markHeight - CELL_BORDER);

		// Area of the complete chart, minus the edge borders
		this._fullChartDimensions = createRect(0, 0, 
									(this._logs.length * (config.markWidth + CELL_BORDER)) - CELL_BORDER, 
									(this._pids.length * (config.markHeight + CELL_BORDER)) - CELL_BORDER);

		// Calculate position boundaries
		this._positionBounds = createRect(0, 0, 
								this._fullChartDimensions.w - (this._chartViewArea.w - (CELL_BORDER * 2)), 
								this._fullChartDimensions.h - (this._chartViewArea.h - (CELL_BORDER * 2)));


		if(this._positionBounds.w < 0){
			this._positionBounds.w = 0;
		}

		if(this._positionBounds.h < 0){
			this._positionBounds.h = 0;
		}

		this._drawLine = this._fullChartDimensions.w;
		
		this._displayInitialized = true;

		return this._view.canvas;
	}


	GanttChartUI.prototype.setPosition = function(x, y){
		/*
		 *	Position is relative to the full chart, and ignores edge borders,
		 *	i.e., position is the coordinates inside the edge borders (not including the bordes)
		 */
		var colOffset, rowOffset,
		 	colEnd, rowEnd,
		 	xEnd, yEnd,
		 	cellWidth = this._displayConfig.markWidth + CELL_BORDER,
		 	cellHeight = this._displayConfig.markHeight + CELL_BORDER,
		 	edgeBorderSize = CELL_BORDER * 2,
		 	xMax, yMax;


		xMax = this._positionBounds.w;
		yMax = this._positionBounds.h;

		if(x < 0 || xMax < 0){
			x = 0;
		}else
		if(x > xMax){
			x = xMax;
		}

		if(y < 0 || yMax < 0){
			y = 0;
		}else
		if(y > yMax){
			y = yMax;
		}
		
		xEnd = x + this._chartViewArea.w - edgeBorderSize - 1;
		yEnd = y + this._chartViewArea.h - edgeBorderSize - 1;

		if(xEnd > this._drawLine - 1){
			xEnd = this._drawLine - 1;
		}

		colOffset = ~~(x / cellWidth);
		colEnd = ~~(xEnd / cellWidth);
		rowOffset = ~~(y / cellHeight);
		rowEnd = ~~(yEnd / cellHeight);


		if(colEnd > this._logs.length - 1){
			colEnd = this._logs.length - 1;
		}

		if(rowEnd > this._pids.length - 1){
			rowEnd = this._pids.length - 1;
		}

		// Set values
		this._x = x;
		this._y = y;
		this._colOffset = colOffset;
		this._colEnd = colEnd;
		this._rowOffset = rowOffset;
		this._rowEnd = rowEnd;
		this._xDrawEnd = xEnd;
		this._yDrawEnd = yEnd;
	}


	GanttChartUI.prototype.getPosition = function(){
		return{
			x: this._x,
			y: this._y
		};
	}


	GanttChartUI.prototype.getPositionBoundsRect = function(){
		return {
			x: this._boundaryRect.x,
			y: this._boundaryRect.y,
			w: this._boundaryRect.w,
			h: this._boundaryRect.h
		};
	}

	/**
	 *	Draw only the label area from the buffer into the main canvas
	 */
	GanttChartUI.prototype.flipLabels = function(){
		var x = this._labelArea.x, y = this._labelArea.y,
			w = this._labelArea.w, h = this._labelArea.h;

		this._view.context.drawImage(this._buffer.canvas, x, y, w, h, x, y, w, h);
	}

	/**
	 *	Draw only the chart area from the buffer into the main canvas
	 */
	GanttChartUI.prototype.flipChart = function(){
		var x = this._chartArea.x, y = this._chartArea.y,
			w = this._chartArea.w, h = this._chartArea.h + this._timelineArea.h;

		this._view.context.drawImage(this._buffer.canvas, x, y, w, h, x, y, w, h);
	}

	/**
	 *	Draw the buffer into the main canvas
	 */
	GanttChartUI.prototype.flip = function(){
		this._view.context.clearRect(0, 0, this._view.canvas.width, this._view.canvas.height);
		this._view.context.drawImage(this._buffer.canvas, 0, 0);
		this._buffer.context.clearRect(0, 0, this._buffer.canvas.width, this._buffer.canvas.height);
	}

	/**
	 *	Draws the whole Gantt chart
	 */
	GanttChartUI.prototype.draw = function(){
		var ctx = this._buffer.context,
			cellWidth = this._displayConfig.markWidth + CELL_BORDER,
			cellHeight = this._displayConfig.markHeight + CELL_BORDER;

		drawLabels(ctx, this._pids, this._rowOffset, this._rowEnd, this._y, cellHeight);

		drawChart(ctx, this._x, this._y, cellWidth, cellHeight, this._chartViewArea, this._colOffset, this._colEnd,
				  this._rowOffset, this._rowEnd, this._xDrawEnd, this._yDrawEnd, this._logs, this._rowMapping);
		
		this.flip();
	}

	/**
	 *	Returns the main(visible) canvas
	 */
	GanttChartUI.prototype.getCanvas = function(){
		return this._view.canvas;
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
	 *	Config options
	 *		- process mark dimensions
	 *		- view dimensions (min, max, exact) - priority: exact -> max/min
	 *		- running and waiting process colors
	 */
	function createDisplayConfig(options, rows){
		options = options || {};

		var config = {},
			viewWidth, viewHeight, minViewWidth, minViewHeight, maxViewWidth, maxViewHeight;


		// Mark dimensions
		config.markWidth = options.markWidth || DEFAULT_MARK_WIDTH;
		config.markHeight = options.markHeight || DEFAULT_MARK_HEIGHT;

		// Mark colors
		config.runningColor = options.runningColor || DEFAULT_RUNNING_COLOR;
		config.waitingColor = options.waitingColor || DEFAULT_WAITING_COLOR;


		// Canvas dimensions
		viewWidth = options.viewWidth || DEFAULT_VIEW_WIDTH;
		viewHeight = options.viewHeight || ((config.markWidth + CELL_BORDER) * (rows + 1)) + CELL_BORDER;

		minViewWidth = options.minViewWidth;
		minViewHeight = options.minViewHeight;
		maxViewWidth = options.maxViewWidth;
		maxViewHeight = options.maxViewHeight;

		// View width bounds
		if(minViewWidth && minViewWidth > viewWidth){
			viewWidth = minViewWidth;
		}
		if(maxViewWidth && maxViewWidth < viewWidth){
			viewWidth = maxViewWidth;
		}

		config.viewWidth = viewWidth;
		
		// View height bounds
		if(minViewHeight && minViewHeight > viewHeight){
			viewHeight = minViewHeight;
		}
		if(maxViewHeight && maxViewHeight < viewHeight){
			viewHeight = maxViewHeight;
		}

		config.viewHeight = viewHeight;

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


	function drawLabels(ctx, labels, rowStart, rowEnd, y, cellHeight){
		var labelx, labely, row;

		labelx = LABEL_MARGIN;
		labely = -(y % cellHeight) + CELL_BORDER + ~~(cellHeight / 2);

		ctx.textAlign = "left";
		ctx.fillStyle = DEFAULT_FONT_COLOR;

		for(row = rowStart; row < rowEnd + 1; row++){
			ctx.fillText("P" + labels[row], labelx, labely);
			labely += cellHeight;
		}
	}


	function drawChart(ctx, x, y, cellWidth, cellHeight, chartView, colOffset, colEnd, rowOffset, rowEnd, xDrawEnd, yDrawEnd, logs, rowMap){
		var xMark, yMark, col, row, i,
			xMarkOffset = chartView.x + CELL_BORDER,
			yMarkOffset = chartView.y + CELL_BORDER,
			markWidth = cellWidth - CELL_BORDER,
			markHeight = cellHeight - CELL_BORDER;


		xMarkStart = -(x % cellWidth);
		yMarkStart = -(y % cellHeight);

		xDrawEnd -= x;
		yDrawEnd -= y;
			
		//	Draw Grid
		drawGrid(ctx, chartView, xMarkStart + cellWidth, yMarkStart + cellHeight, cellWidth, cellHeight);
			

		// Draw running marks
		ctx.fillStyle = DEFAULT_RUNNING_COLOR;
		xMark =  xMarkStart;
		for(col = colOffset; col < colEnd + 1; col++){
			log = logs[col];
			row = log.running && rowMap[log.running.id];

			if(row !== null && row > -1 && row < rowEnd + 1){
				yMark = yMarkStart + ((row - rowOffset) * cellHeight);
				drawMark(ctx, xMarkOffset, yMarkOffset, xMark, yMark, markWidth, markHeight, xDrawEnd, yDrawEnd);
			}

			xMark += cellWidth;
		}

		// Draw waiting marks
		ctx.fillStyle = DEFAULT_WAITING_COLOR;
		xMark = xMarkStart;
		for(col = colOffset; col < colEnd + 1; col++){
			log = logs[col];
			waiting = log.waiting;

			for(i = 0; i < waiting.length; i++){
				row = rowMap[waiting[i].id];

				if(row !== null && row > -1 && row < rowEnd + 1){
					yMark = yMarkStart + ((row - rowOffset) * cellHeight);
					drawMark(ctx, xMarkOffset, yMarkOffset, xMark, yMark, markWidth, markHeight, xDrawEnd, yDrawEnd);
				}
			}

			xMark += cellWidth;
		}

		
		// Draw Timeline
		ctx.fillStyle = DEFAULT_FONT_COLOR;
		ctx.textAlign = "center";
		xMark = xMarkOffset + xMarkStart + ~~(cellWidth / 2);
		yMark = yMarkOffset + chartView.h + ~~(cellHeight / 2);
		for(col = colOffset; col < colEnd + 1; col++){
			ctx.fillText(col, xMark, yMark);
			xMark += cellWidth;
		}

	}

	/**
	 *	Draws a grid on the specified rectangular area `chartViewArea.`The first grid lines will be drawn
	 *	based on the values of `startx` and `starty`.
	 *	
	 *	@param ctx - CanvasRenderingContext
	 *	@param chartViewArea - rectangular area to draw grid
	 *	@param startx - x offset to start drawing vertical grid lines
	 *	@param starty - y offset to start drawing horizontal grid lines
	 *	@param cellWidth
	 *	@param cellHeight 
	 */
	function drawGrid(ctx, chartViewArea, startx, starty, cellWidth, cellHeight){
		var cx = chartViewArea.x, cy = chartViewArea.y,
			cw = chartViewArea.w, ch = chartViewArea.h,
			x = cx + startx + 0.5,
			y = cy + starty + 0.5,
			xLineEnd = cx + cw - 1,
			yLineEnd = cy + ch - 1;


		ctx.strokestyle = DEFAULT_BORDER_COLOR;
		// Draw edge borders
		ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1);
		// Draw grid
		ctx.beginPath();
		while(x < xLineEnd){
			ctx.moveTo(x, cy);
			ctx.lineTo(x, yLineEnd);
			x += cellWidth;
		}

		while(y < yLineEnd){
			ctx.moveTo(cx, y);
			ctx.lineTo(xLineEnd, y);
			y += cellHeight;
		}

		ctx.closePath();
		ctx.stroke();
	}

	/**
	 *	@param ctx - CanvasRenderingContext
	 *	@param cx - x offset
	 *	@param cy - y offset
	 */
	function drawMark(ctx, cx, cy, markx, marky, markWidth, markHeight, xDrawEnd, yDrawEnd){
		var cut, markw, markh;

		if(markx < 0){
			markw = markWidth + markx;
			markx = 0;
		}else{
			cut = xDrawEnd - markx + 1;
			markw = (markWidth > cut ? cut : markWidth);
		}

		if(marky < 0){
			markh = markHeight + marky;
			marky = 0;
		}else{
			cut = yDrawEnd - marky + 1;
			markh = (markHeight > cut ? cut : markHeight);
		}

		ctx.fillRect(cx + markx, cy + marky, markw, markh);
	}


	global.CPUscheduling.GanttChartUI = GanttChartUI;


})(this);