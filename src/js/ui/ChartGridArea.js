(function(global){
	
	// Load classes
	var Box = global.CPUscheduling.Box,
		Dimensions = global.CPUscheduling.Dimensions;


	/**
	 *	ChartGridArea class
	 *
	 *	@param values [object]
	 *		
	 *	values required properties:
	 *		- fullGridDimensions [Dimensions]
	 *		- viewArea [Box]
	 *		- cellDimensions [Dimensions]
	 *		- ids
	 *		- logs
	 */
	function ChartGridArea(values){
		//this._mainGUI = mainGUI;

		// Data
		this._ids = values.ids;
		this._logs = values.logs;
		this._idRowMap = (function(){
			var i, len = values.ids.length, map = {};

			for(i = 0; i < len; i++){
				map[values.ids[i]] = i;
			}

			return map;
		})();


		// Dimensions
		this._fullGridDimensions = values.fullGridDimensions;
		this._viewArea = values.viewArea;
		this._cellDimensions = values.cellDimensions;

	}


	/**
	 * 
	 *	@param ctx [CanvasRenderingContext2d]
	 *	@param x x-coordinate in full grid area
	 *	@param y y-coordinate in full grid area
	 */
	ChartGridArea.prototype.draw = function(ctx, x, y){
		var cw = this._cellDimensions.w,
			ch = this._cellDimensions.h,
			xOffset, yOffset,
			colStart, colEnd,
			rowStart, rowEnd;


			// Column calculations	
			xOffset = -(x % cw);
			colStart = ~~(x / cw);
			colEnd = colStart + ~~((this._viewArea.w - xOffset - 1) / cw) + 1; // zero-indexed + width (note: this is 1 more than the last column)

			if(colEnd > this._logs.length){
				colEnd = this._logs.length;
			}

			// Row calculations
			yOffset = -(y % ch);
			rowStart = ~~(y / ch);
			rowEnd = rowStart + ~~((this._viewArea.h - yOffset - 1) / cw) + 1;

			if(rowEnd > this._ids.length){
				rowEnd = this._ids.length;
			}

			/*				TEMPORARY				*/
			ctx.fillStyle = "#5555EE";
			ctx.fillRect(this._viewArea.x, this._viewArea.y, this._viewArea.w, this._viewArea.h);
		

			/*--------------------------------------*/
			drawGridLines(ctx, this._viewArea, xOffset + cw - 1, yOffset + ch - 1);
	}


	/*-----------------------------------------------*\
					Private Functions
	\*-----------------------------------------------*/

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


	global.CPUscheduling.ChartGridArea = ChartGridArea;

})(this);