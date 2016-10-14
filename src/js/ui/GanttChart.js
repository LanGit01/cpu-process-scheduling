(function(global){

	// Check namespace
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}

	var DEFAULT_MARK_WIDTH = 24,
		DEFAULT_MARK_HEIGHT = 24,
		DEFAULT_VIEW_WIDTH = 800,
		DEFAULT_FONT = "12px sans-serif",
		DEFAULT_FONT_COLOR,
		DEFAULT_RUNNING_COLOR = "#333333",
		DEFAULT_WAITING_COLOR = "#aaaaaa",
		DEFAULT_CELL_SPACE_COLOR = "#555555";
		AUTO = -1,
		NO_VALUE = -2,
		CELL_SPACING = 1,
		PID_LABEL_PAD = 10;


	function GanttChart(pids, logs){
		var i, itr;

		pids = selectionSort(pids, comparePid);

		this._pids = pids;

		// Map PIDs to chart row
		this._rowMapping = {};
		for(i = 0; i < pids.length; i++){
			this._rowMapping[pids[i]] = i;
		}

		// Convert logs from linked list to array
		this._logs = [];
		itr = logs.getIterator();
		while(itr.hasNext()){
			this._logs[this._logs.length] = itr.getNext();
		}


		this._chartWidth = 0;
		this._chartHeight = 0;

		/*			Canvas Display		*/
		
		// Canvas
		this._view = null;
		this._viewCtx = null;
		this._buffer = null;
		this._bufferCtx = null;

		// Positioning
		this._x = 0;
		this._y = 0;
		this._chartOffset = 0;	// To allow space for PID labels
		this._drawLine = 0;		// Every mark to the right of the line is not drawn

		//	Display options
		this._markWidth = DEFAULT_MARK_WIDTH;
		this._markHeight = DEFAULT_MARK_HEIGHT;
		this._runningColor = DEFAULT_RUNNING_COLOR;
		this._waitingColor = DEFAULT_WAITING_COLOR;
		this._viewWidth = 0;
		this._viewHeight = 0;

		this._displayOptions = {};

	}


	GanttChart.prototype.createDisplay = function(options){
		var viewWidth, viewHeight, 
			view, viewCtx, buffer, bufferCtx, i,
			displayOptions = this._displayOptions;

		setDisplayOptions(this, options);

		// Calculate dimensions of chart (full size)
		this._x = this._y = 0;		// With respect to the chart ONLY (does not include space of labels)
		this._chartWidth = (this._logs.length * (this._markWidth + CELL_SPACING)) + CELL_SPACING;
		this._chartHeight = (this._pids.length * (this._markHeight + CELL_SPACING)) + CELL_SPACING;

		// Create canvas
		view = document.createElement("canvas");
		view.width = displayOptions.viewWidth;
		view.height = displayOptions.viewHeight;
		viewCtx = view.getContext("2d");
		this._view = view;
		this._viewCtx = viewCtx;

		// Determine chartOffset by measuring pid string length
		this._chartOffset = this._viewCtx.measureText("P" + this._pids[this._pids.length - 1]).width + (PID_LABEL_PAD * 2);

		buffer = document.createElement("canvas");
		buffer.width = displayOptions.viewWidth;
		buffer.height = displayOptions.viewHeight;
		bufferCtx = buffer.getContext("2d");
		this._buffer = buffer;
		this._bufferCtx = bufferCtx;


		this._drawLine = viewWidth - this._chartOffset;

		// Initialize contexts
		bufferCtx.font = DEFAULT_FONT;
		bufferCtx.textBaseline = "middle";
		
		return this._view;
	}


	GanttChart.prototype.flip = function(){

		this._viewCtx.drawImage(this._buffer, 0, 0);
	}


	GanttChart.prototype.flipLabels = function(){
		var x = y = 0,
			w = this._chartOffset, h = this._buffer.height;

		this._viewCtx.drawImage(this._buffer, x, y, w, h, x, y, w, h);
	}


	GanttChart.prototype.flipChart = function(){
		var x = this._chartOffset, y = 0, 
			w = this._buffer.width - x, h = this._buffer.height;

		this._viewCtx.drawImage(this._buffer, x, y, w, h, x, y, w, h);
	}
	

	GanttChart.prototype.drawLabels = function(){
		var i, x, y
			cellHeight = this._markHeight + CELL_SPACING,
			ctx = this._bufferCtx;

		x = PID_LABEL_PAD;
		y = ~~(cellHeight / 2) + CELL_SPACING;
		for(i = 0; i < this._pids.length; i++){
			ctx.fillText("P" + this._pids[i], x, y);
			y += cellHeight;
		}

		this.flipLabels();
	}


	GanttChart.prototype.drawChart = function(){
	
		var x = this._x,
			y = this._y,
			xEnd = x + this._view.width,
			yEnd = y + this._view.height,
			markWidth = this._markWidth,
			markHeight = this._markHeight,
			cellWidth = markWidth + CELL_SPACING,
			cellHeight = markWidth + CELL_SPACING,
			chartOffset = this._chartOffset,
			ctx = this._bufferCtx,
			gridStartX, gridColEnd, gridStartY,
			colStart, colEnd, rowStart, rowEnd, i, log, waiting, row, col,
			markx, marky, markw, markh;

		/*			Calculate drawing ranges		*/
		gridColEnd = ~~(xEnd / cellWidth);

		if(xEnd > this._drawLine){
			xEnd = this._drawLine;
		}

		colStart = ~~(x / cellWidth);
		colEnd = ~~(xEnd / cellWidth);
		rowStart = ~~(y / cellHeight);
		rowEnd = ~~(yEnd / cellHeight);

		if(colEnd > this._logs.length - 1){
			colEnd = this._logs.length - 1;
			xEnd = this._chartWidth;
		}

		if(rowEnd > this._pids.length - 1){
			rowEnd = this._pids.length - 1;
			yEnd = this._chartHeight;
		}

		/*				Drawing				*/
		// Clear Background
		ctx.clearRect(this._chartOffset, 0, this._buffer.width, this._buffer.height);		
		
		//x += this._chartOffset;		// Adjust to accomodate labels
		gridStartX = ((colStart + 1) * cellWidth) - x + chartOffset;
		gridStartY = ((rowStart + 1) * cellHeight) - y;

		// Draw Grid
		ctx.strokeStyle = DEFAULT_CELL_SPACE_COLOR;
		ctx.strokeRect(this._chartOffset + 0.5, 0.5, this._buffer.width - this._chartOffset - 1, this._buffer.height - 1);
		drawGrid(ctx, gridStartX, gridStartY, (gridColEnd - colStart), (rowEnd - colStart), cellWidth, cellHeight, this._buffer.width, this._buffer.height);

		/*			Draw Marks			*/

		// Draw Running
		ctx.fillStyle = DEFAULT_RUNNING_COLOR;
		for(col = colStart; col <= colEnd; col++){
			log = this._logs[col];
			row = log.running && this._rowMapping[log.running.id];

			if(row != null){
				drawMark(ctx, x, y, xEnd, yEnd, chartOffset, col, row, cellWidth, cellHeight);
			}
		}

		// Draw Waiting
		ctx.fillStyle = DEFAULT_WAITING_COLOR;
		for(col = colStart; col <= colEnd; col++){
			log = this._logs[col];
			waiting = log.waiting;

			for(i = 0; i < waiting.length; i++){
				row = this._rowMapping[waiting[i].id];

				if(row !== null){
					drawMark(ctx, x, y, xEnd, yEnd, chartOffset, col, row, cellWidth, cellHeight);
				}
			}
		}


		this.flipChart();
	}


	GanttChart.prototype.setVisible = function(boolValue){
		if(boolValue){
			this.drawLabels();
			this.drawChart();
		}else{
			this._viewCtx.clearRect(0, 0, this._view.width, this._view.height);
		}
	}


	/*				Helper Functions			*/
	function setDisplayOptions(that, options){
		var d = that._displayOptions;

		/*	markWidth, markHeight
		 *	viewWidth, viewHeight
		 * 	runningColor, waitingColor
		 */
		if(typeof options === "object"){
			d.markWidth = options.markWidth || DEFAULT_MARK_WIDTH;
			d.markHeight = options.markHeight || DEFAULT_MARK_HEIGHT;

			d.viewWidth = options.viewWidth || DEFAULT_VIEW_WIDTH;
			d.viewHeight = options.viewHeight || ((d.markHeight + CELL_SPACING) * that._pids.length + CELL_SPACING);

			d.runningColor = options.runningColor || DEFAULT_RUNNING_COLOR;
			d.waitingColor = options.waitingColor || DEFAULT_WAITING_COLOR;
		}else{
			d.markWidth = DEFAULT_MARK_WIDTH;
			d.markHeight = DEFAULT_MARK_HEIGHT;

			d.viewWidth = DEFAULT_VIEW_WIDTH;
			d.viewHeight = ((d.markHeight + CELL_SPACING) * that._pids.length + CELL_SPACING);
			
			d.runningColor = DEFAULT_RUNNING_COLOR;
			d.waitingColor = DEFAULT_WAITING_COLOR;
		}
	}


	function drawGrid(ctx, startx, starty, numCols, numRows, markWidth, markHeight, screenWidth, screenHeight){
		// (colStart, colEnd]
		var i, j
			x = startx + 0.5, y = starty + 0.5;

		ctx.beginPath();

		for(i = 0; i < numCols + 1; i++){
			ctx.moveTo(x, 0);
			ctx.lineTo(x, screenHeight);
			x += markWidth;
		}

		for(i = 0; i < numRows; i++){
			ctx.moveTo(0, y);
			ctx.lineTo(screenWidth, y);
			y += markHeight;
		}

		ctx.closePath();
		ctx.stroke();
	}



	function drawMark(ctx, x, y, xEnd, yEnd, chartOffset, col, row, cellWidth, cellHeight){
		// Cut is the distance of a mark's left/top side to the right/bottom edge of canvas, respectively 
		var markx, marky, markw, markh, cut;

		// calculate mark x-axis dimensions
		markx = (col * cellWidth) - x;
		if(markx < 0){
			markw = cellWidth + markx;	// -1 ?
			markx = 0;
		}else{
			cut = (xEnd - markx);
			markw = (cellWidth > cut ? cut : cellWidth);
		}

		// calculate mark y-axis dimensions
		marky = (row * cellHeight) - y;
		if(marky < 0){
			markh = cellHeight + marky;
			marky = 0;
		}else{
			cut = (yEnd - marky);
			markh = (cellHeight > cut ? cut : cellHeight);
		}

		ctx.fillRect(markx + chartOffset + 0.5, marky + 0.5, markw - CELL_SPACING, markh - CELL_SPACING);
	}






	/*			Auxillary Functions			*/
	function comparePid(p1, p2){
		var id1 = p1.id,
			id2 = p2.id;

		if(id1 > id2){
			return 1;
		}else
		if(id1 < id2){
			return -1;
		}else{
			return 0;
		}
	

	}

	global.CPUscheduling.GanttChart = GanttChart;

})(this);