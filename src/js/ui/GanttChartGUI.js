(function(global){


	// Load classes
	var ChartGridArea = global.CPUscheduling.ChartGridArea,
		LabelStrip = global.CPUscheduling.LabelStrip;


	// Defaults
	var DEFAULT_CANVAS_WIDTH = 800,
		DEFAULT_CANVAS_HEIGHT = 200,
		DEFAULT_CELL_WIDTH = 24,
		DEFAULT_CELL_HEIGHT = 24,
		ID_LABEL_WIDTH = 24,
		TIME_LABEL_HEIGHT = 24,

		MAIN_BORDER_SIZE = 1,
		CELL_BORDER_SIZE = 1,

		CELL_PADDING = 4,
		
		DEFAULT_FONT = "monospace",
		DEFAULT_FONT_SIZE = 14;



	/*
	 * GanttChartGUI class
	 *
	 *	@param ids [array]
	 *	@param logs [array]
	 */
	function GanttChartGUI(ids, logs){
		// Data
		this._ids = ids;
		this._logs = logs;

		this._config = null;


		// Basic dimensions
		this._cellWidth = DEFAULT_CELL_WIDTH;
		this._cellHeight = DEFAULT_CELL_HEIGHT;

		// Areas
		this._chartGridArea = null;
		this._idLabelStrip = null;
		this._timeLabelStrip = null;

		this._displayArea = null;	// Actual size of the GUI Area (including borders)

		// Grid chart position
		this._x = 0;
		this._y = 0;
		this._positionBounds = null;

		// Canvas
		this._displayCanvas = null;
		this._bufferCanvas = null;
	}



	GanttChartGUI.prototype.initialize = function(container, config){
		/*
		 *	Config:
		 *		- Canvas Dimensions
		 *		- Cell Dimensions
		 *
		 */
		 var timeLabelWidth, timeLabelHeight,
		 	 idLabelWidth, idLabelHeight, time, timeArr = [];


		this._config = createConfig(config);


		// Create canvas and buffer
		this._displayCanvas = new CanvasWrapper(this._config.canvasWidth, this._config.canvasHeight);
		this._bufferCanvas = new CanvasWrapper(this._config.canvasWidth, this._config.canvasHeight);
		container.appendChild(this._displayCanvas.canvas);

		this.computeDimensions();



		// Initialize label strips
		this._idLabelStrip.initializeStripImage(this._ids, DEFAULT_FONT_SIZE + "px " + DEFAULT_FONT);
		
		for(time = 0; time < this._logs.length; time++){
			timeArr[time] = time;
		}
		this._timeLabelStrip.initializeStripImage(timeArr, DEFAULT_FONT_SIZE + "px " + DEFAULT_FONT);
	}


	GanttChartGUI.prototype.computeDimensions = function(){
		var gcSize, tlSize, ilSize,
			fgArea, dArea, idArea, tArea, gArea,
			dCellWidth = this._config.cellWidth,
			dCellHeight = this._config.cellHeight,
			ctx = this._bufferCanvas.ctx;


		/*
		 *	Border behavior
		 *
		 *	Basic Dimensions - right and bottom side of a basic dimension is part of the border
		 *	Area Dimensions - no borders are inside the area
		 */


		// Basic Dimensions
		tlSize = new Dimensions(
			Math.max(dCellWidth, DEFAULT_FONT_SIZE + getAdjustedStringWidth(ctx, (this._logs.length - 1).toString())),
			~~(1.5 * DEFAULT_FONT_SIZE)
		);

		idSize = new Dimensions(
			DEFAULT_FONT_SIZE + getAdjustedStringWidth(ctx, getLargestNumber(this._ids).toString()),
			Math.max(dCellHeight, 2 * DEFAULT_FONT_SIZE)
		);

		gcSize = new Dimensions(tlSize.w, idSize.h);



		/*------------------ Areas ------------------------*/

		// Full Grid Area
		fgArea = new Dimensions(
			this._logs.length * gcSize.w - MAIN_BORDER_SIZE,
			this._ids.length * gcSize.h - MAIN_BORDER_SIZE
		);

		// Display Area
		dArea = new Box(0, 0,
			Math.min(this._config.canvasWidth, fgArea.w + idSize.w + (3 * MAIN_BORDER_SIZE)),
			Math.min(this._config.canvasHeight, fgArea.h + tlSize.h + (3 * MAIN_BORDER_SIZE))
		);

		// ID Area
		idLabelStrip = new LabelStrip(
			MAIN_BORDER_SIZE,
			MAIN_BORDER_SIZE,
			idSize.w,
			dArea.h - tlSize.h - (3 * MAIN_BORDER_SIZE),
			idSize.w,
			idSize.h,
			false
		);

		// Time Area
		timeLabelStrip = new LabelStrip(
			idLabelStrip.w + (2 * MAIN_BORDER_SIZE),
			dArea.h - tlSize.h - MAIN_BORDER_SIZE,
			dArea.w - idLabelStrip.w - (3 * MAIN_BORDER_SIZE),
			tlSize.h,
			tlSize.w,
			tlSize.h,
			true
		);


		// Grid Area
		gArea = new UIArea(
			idLabelStrip.w + (2 * MAIN_BORDER_SIZE),
			MAIN_BORDER_SIZE,
			dArea.w - idLabelStrip.w - (3 * MAIN_BORDER_SIZE),
			dArea.h - timeLabelStrip.h - (3 * MAIN_BORDER_SIZE),
			gcSize.w,
			gcSize.h
		);

		this._chartGridArea = new ChartGridArea({
			fullGridDimensions: fgArea,
			viewArea: gArea,
			cellDimensions: gcSize,
			ids: this._ids,
			logs: this._logs
		});

		this._positionBounds = new Dimensions(fgArea.w - gArea.w, fgArea.h - gArea.h);
		

		// Augment 'this'
		this._displayArea = dArea;
		this._idLabelStrip = idLabelStrip;
		this._timeLabelStrip = timeLabelStrip;
	}


	GanttChartGUI.prototype.setPosition = function(x, y){
		if(x < 0 || y < 0){
			return false;
		}

		this._x = Math.min(x, this._positionBounds.w);
		this._y = Math.min(y, this._positionBounds.h);

		console.log("Position set to: (" + this._x + ", " + this._y + ")");

		return true;
	}


	GanttChartGUI.prototype.draw = function(){
		var ctx = this._bufferCanvas.ctx;

		var buffer = this._bufferCanvas,
			display = this._displayCanvas;

		// Clear
		buffer.ctx.clearRect(0 ,0, buffer.canvas.width, buffer.canvas.height);
		display.ctx.clearRect(0, 0, display.canvas.width, display.canvas.height);

		/*			TEMPORARY			*/
		ctx.fillStyle = "#DDDDDD";
		ctx.fillRect(0, 0, this._displayArea.w, this._displayArea.h);
		
		ctx.fillStyle = "#EE5555";
		ctx.fillRect(this._idLabelStrip.x, this._idLabelStrip.y, this._idLabelStrip.w, this._idLabelStrip.h);

		ctx.fillStyle = "#55EE55";
		ctx.fillRect(this._timeLabelStrip.x, this._timeLabelStrip.y, this._timeLabelStrip.w, this._timeLabelStrip.h);
		
		/*------------------------------*/

		// Draw Areas
		this._idLabelStrip.draw(buffer.ctx, this._y);
		this._timeLabelStrip.draw(buffer.ctx, this._x);
		this._chartGridArea.draw(buffer.ctx, this._x, this._y);

		// Draw Borers
		drawBorders(buffer.ctx, this._displayArea, this._idLabelStrip);
		/*
		ctx.strokeRect(this._displayArea.x, this._displayArea.y, this._displayArea.w, this._displayArea.h);
		
		ctx.beginPath();

		ctx.moveTo(this._idLabelStrip.x, this._timeLabelStrip.y);
		ctx.lineTo(this._chartGridArea.x + this._chartGridArea.w, this._timeLabelStrip.y);
		
		console.log(this._chartGridArea.x);

		ctx.moveTo(this._chartGridArea.x, this._chartGridArea.y);
		ctx.lineTo(this._chartGridArea.x, this._chartGridArea.y + this._chartGridArea.h);
		
		ctx.closePath();
		ctx.stroke();*/

		// Flip
		display.ctx.drawImage(buffer.canvas, 0, 0);
	}


	/*-----------------------------------------------*\
					Private Functions
	\*-----------------------------------------------*/

	function drawBorders(ctx, displayArea, idArea){
		var leftEdge = displayArea.x,
			rightEdge = displayArea.x + displayArea.w - 1,
			topEdge = displayArea.y,
			bottomEdge = displayArea.y + displayArea.h - 1,
			vSeparator = idArea.x + idArea.w + 0.5,
			hSeparator = idArea.y + idArea.h + 0.5;

		ctx.strokeRect(displayArea.x, displayArea.y, displayArea.w, displayArea.h);

		ctx.beginPath();
		
		ctx.moveTo(vSeparator, topEdge);
		ctx.lineTo(vSeparator, bottomEdge);

		ctx.moveTo(leftEdge, hSeparator);
		ctx.lineTo(rightEdge, hSeparator);

		ctx.closePath();
		ctx.stroke();
	}


	function createConfig(config){
		var configObj = {};

		config = config || {};

		configObj.canvasWidth = config.canvasWidth || DEFAULT_CANVAS_WIDTH;
		configObj.canvasHeight = config.canvasHeight || DEFAULT_CANVAS_HEIGHT;

		configObj.cellWidth = config.cellWidth || DEFAULT_CELL_WIDTH;
		configObj.cellHeight = config.cellHeight || DEFAULT_CELL_HEIGHT;

		return configObj;
	}


	


	/*-----------------------------------------------*\
					Auxillary Classes
	\*-----------------------------------------------*/

	function Dimensions(w, h){
		this.w = w;
		this.h = h;
	}


	function Box(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}


	function CanvasWrapper(w, h){
		this.canvas = document.createElement("canvas");
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx = this.canvas.getContext("2d");
	}


	function UIArea(x, y, w, h, cellWidth, cellHeight){
		var box = new Box(x, y, w, h);
		box.cellWidth = cellWidth;
		box.cellHeight = cellHeight;
		return box;
	}


	/*-----------------------------------------------*\
					Helper Functions
	\*-----------------------------------------------*/

	function getLargestNumber(ar){
		var i,
			max = ar[0];


		for(i = 1; i < ar.length; i++){
			if(ar[i] > max){
				max = ar[i];
			}
		}

		return max;
	}


	function getSmallestNumber(ar){
		var i,
			min = ar[0];


		for(i = 1; i < ar.length; i++){
			if(ar[i] < min){
				min = ar[i];
			}
		}

		return min;
	}


	function getAdjustedStringWidth(ctx, str){
		var newStr = "0".repeat(str.length);
		return ctx.measureText(newStr).width;
	}


	




	global.CPUscheduling.GanttChartGUI = GanttChartGUI;

})(this);