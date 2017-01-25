(function(global){

	// Defaults
	var DEFAULT_CANVAS_WIDTH = 800,
		DEFAULT_CANVAS_HEIGHT = 300,
		DEFAULT_CELL_WIDTH = 24,
		DEFAULT_CELL_HEIGHT = 24,
		ID_LABEL_WIDTH = 24,
		TIME_LABEL_HEIGHT = 24,

		MAIN_BORDER_SIZE = 1,
		CELL_BORDER_SIZE = 1,

		CELL_PADDING = 4,
		
		DEFAULT_FONT = "sans-serif",
		DEFAULT_FONT_SIZE = 12;


	/*
	 * GanttChartGUI class
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
		this._displayArea = null;	// Actual size of the GUI Area (including borders)
		this._idArea = null;
		this._timeArea = null;
		this._gridArea = null;
		this._fullGridArea = null;

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
		 	 idLabelWidth, idLabelHeight;


		this._config = createConfig(config);


		// Create canvas and buffer
		this._displayCanvas = new CanvasWrapper(this._config.canvasWidth, this._config.canvasHeight);
		this._bufferCanvas = new CanvasWrapper(this._config.canvasWidth, this._config.canvasHeight);
		container.appendChild(this._displayCanvas.canvas);


		this.computeDimensions();

		drawGridArea(this._bufferCanvas.ctx, this._gridArea, 0, 0, 71, 10);


		// Debugging
		this._displayCanvas.ctx.drawImage(this._bufferCanvas.canvas, 0, 0);

	}


	GanttChartGUI.prototype.computeDimensions = function(){
		var gcSize, tlSize, ilSize,
			fgArea, dArea, idArea, tArea, gArea,
			dCellWidth = this._config.cellWidth,
			dCellHeight = this._config.cellHeight,
			ctx = this._bufferCanvas.ctx,
			totalPadding = 2 * CELL_PADDING;


		/*
		 *	Border behavior
		 *
		 *	Basic Dimensions - right and bottom side of a basic dimension is part of the border
		 *	Area Dimensions - no borders are inside the area
		 */


		// Basic Dimensions
		tlSize = new Dimensions(
			Math.max(dCellWidth, totalPadding + getAdjustedStringWidth(ctx, (this._logs.getLength() - 1).toString())),
			totalPadding + DEFAULT_FONT_SIZE
		);

		idSize = new Dimensions(
			totalPadding + getAdjustedStringWidth(ctx, getLargestNumber(this._ids).toString()),
			Math.max(dCellHeight, totalPadding + DEFAULT_FONT_SIZE)
		);

		gcSize = new Dimensions(tlSize.w, idSize.h);



		/*------------------ Areas ------------------------*/

		// Full Grid Area
		fgArea = new Dimensions(
			this._logs.getLength() * gcSize.w - MAIN_BORDER_SIZE,
			this._ids.length * gcSize.h - MAIN_BORDER_SIZE
		);

		// Display Area
		dArea = new Box(0, 0,
			Math.min(this._config.canvasWidth, fgArea.w + idSize.w + (3 * MAIN_BORDER_SIZE)),
			Math.min(this._config.canvasHeight, fgArea.h + tlSize.h + (3 * MAIN_BORDER_SIZE))
		);

		// ID Area
		idArea = new UIArea(
			MAIN_BORDER_SIZE,
			MAIN_BORDER_SIZE,
			idSize.w,
			dArea.h - (2 * MAIN_BORDER_SIZE),
			idSize.w,
			idSize.h
		);

		// Time Area
		tArea = new UIArea(
			idArea.w + (2 * MAIN_BORDER_SIZE),
			dArea.h - tlSize.h - MAIN_BORDER_SIZE,
			dArea.w - idArea.w - (3 * MAIN_BORDER_SIZE),
			tlSize.h,
			tlSize.w,
			tlSize.h
		);

		// Grid Area
		gArea = new UIArea(
			idArea.w + (2 * MAIN_BORDER_SIZE),
			MAIN_BORDER_SIZE,
			dArea.w - idArea.w - (3 * MAIN_BORDER_SIZE),
			dArea.h - tArea.h - (3 * MAIN_BORDER_SIZE),
			gcSize.w,
			gcSize.h
		);


		this._positionBounds = new Dimensions(fgArea.w - gArea.w, fgArea.h - gArea.h);
		

		// Augment 'this'
		this._fullGridArea = fgArea;
		this._displayArea = dArea;
		this._idArea = idArea;
		this._timeArea = tArea;
		this._gridArea = gArea;



		ctx.fillStyle = "#DDDDDD";
		ctx.fillRect(0, 0, dArea.w, dArea.h);
		
		ctx.fillStyle = "#AA0000";
		ctx.fillRect(idArea.x, idArea.y, idArea.w, idArea.h);

		ctx.fillStyle = "#00AA00";
		ctx.fillRect(tArea.x, tArea.y, tArea.w, tArea.h);

		ctx.fillStyle = "#0000AA";
		ctx.fillRect(gArea.x, gArea.y, gArea.w, gArea.h);
	}



	GanttChartGUI.prototype.draw = function(){

	}


	/*-----------------------------------------------*\
					Private Functions
	\*-----------------------------------------------*/


	function createConfig(config){
		var configObj = {};

		config = config || {};

		configObj.canvasWidth = config.canvasWidth || DEFAULT_CANVAS_WIDTH;
		configObj.canvasHeight = config.canvasHeight || DEFAULT_CANVAS_HEIGHT;

		configObj.cellWidth = config.cellWidth || DEFAULT_CELL_WIDTH;
		configObj.cellHeight = config.cellHeight || DEFAULT_CELL_HEIGHT;

		return configObj;
	}


	function drawGridArea(ctx, gArea, x, y, maxRows, maxCols){
		var cw = gArea.cellWidth,
			ch = gArea.cellHeight;

		var xOffset, yOffset,
			colStart, colEnd;

		// Column calculations
		xOffset = -(x % cw);
		colStart = ~~(x / cw);
		colEnd = colStart + ~~((gArea.w - xOffset - 1) / cw) + 1; // zero-indexed + width (note: this is 1 more than the last column)

		if(colEnd > maxCols){
			colEnd = maxCols;
		}

		// Row calculations
		yOffset = -(y % ch);
		rowStart = ~~(y / ch);
		rowEnd = rowStart + ~~((gArea.h - yOffset - 1) / cw) + 1;

		
		drawGridLines(ctx, gArea, xOffset + cw, yOffset + ch);
		
	}

	
	function drawGridLines(ctx, area, xOffset, yOffset){
		var xLine = area.x + xOffset + 0.5,
			yLine = area.y + yOffset + 0.5,
			xAreaEnd = area.x + area.w,
			yAreaEnd = area.y + area.h,
			cw = area.cellWidth,
			ch = area.cellHeight;

		ctx.beginPath();
		while(xLine < xAreaEnd){
			ctx.moveTo(xLine, area.y);
			ctx.lineTo(xLine, yAreaEnd - 1);
			xLine += cw;
		}

		while(yLine < yAreaEnd){
			ctx.moveTo(area.x, yLine);
			ctx.lineTo(xAreaEnd - 1, yLine);
			yLine += ch;
		}

		ctx.closePath();
		ctx.stroke();
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