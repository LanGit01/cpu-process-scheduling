(function(global){
	
	// Load classes
	var Box = global.CPUscheduling.Box,
		Dimensions = global.CPUscheduling.Dimensions;

	// Defaults
	var DEFAULT_RUNNING_COLOR = "#333333",
		DEFAULT_WAITING_COLOR = "#999999";

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

		this._imagesheet = createMarkImagesheet(this._cellDimensions.w - 1, this._cellDimensions.h - 1);
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


		this._drawGridLines(ctx, this._viewArea, xOffset + cw - 1, yOffset + ch - 1);
		this._drawMarks(ctx, xOffset, colStart, colEnd, yOffset, rowStart, rowEnd);
	}


	ChartGridArea.prototype._drawGridLines = function(ctx, area, xOffset, yOffset){
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


	ChartGridArea.prototype._drawMarks = function(ctx, xOffset, colStart, colEnd, yOffset, rowStart, rowEnd){
		var log, waiting, i,
			col = colStart, row,
			x = xOffset, y,
			cw = this._cellDimensions.w,
			ch = this._cellDimensions.h;

		while(col < colEnd){
			log = this._logs[col];

			// Draw running (if there is)
			if(log && log.running){
				row = this._idRowMap[log.running.id];

				// If visible
				if(row >= rowStart && row < rowEnd){
					y = yOffset + ((row - rowStart) * ch);
					drawMark(ctx, x, y, cw, ch, this._viewArea, this._imagesheet, 0);
				}
			}

			// Draw waiting (if there is)
			// Note: Deciding if i should move this inside log.running if-conditional
			//		 because technically there shouldn't be waiting processes if there is no running process
			if(log && log.waiting){
				waiting = log.waiting;

				for(i = 0; i < waiting.length; i++){
					row = this._idRowMap[waiting[i].id];

					// If visible
					if(row >= rowStart && row < rowEnd){
						y = yOffset + ((row - rowStart) * ch);
						drawMark(ctx, x, y, cw, ch, this._viewArea, this._imagesheet, 1);
					}
				}
			}

			col++;
			x += cw;
		}
	}

	/*-----------------------------------------------*\
					Private Functions
	\*-----------------------------------------------*/

	function drawMark(ctx, x, y, cw, ch, area, img, imgIndex){
		var w = cw - 1, h = ch - 1;

		if(x < 0){
			w += x;
			x = 0;
		}else
		if(x + cw > area.w){
			w = area.w - x;
		}

		if(y < 0){
			h += y;
			y = 0;
		}else
		if(y > area.h + ch - 1){
			h = area.h - y;
		}

		ctx.drawImage(img, (cw - 1) * imgIndex, 0, w, h, area.x + x, area.y + y, w, h);
	}


	function computeMarkBox(x, y, w, h, areaw, areah){
		if(x < 0){
			w += x;
			x = 0;
		}else
		if(x > areaw + w - 1){
			w = w - (areaw - x);
		}

		if(y < 0){
			h += y;
			y = 0;
		}else
		if(y > areah + h - 1){
			h = h - (areah - y);
		}

		return new Box(x, y, w, h);
	}


	function createMarkImagesheet(cw, ch){
		var img = new Image(),
			tempCanvas = document.createElement("canvas"),
			ctx = tempCanvas.getContext("2d");

		tempCanvas.width = cw * 2;
		tempCanvas.height = ch;

		ctx.fillStyle = DEFAULT_RUNNING_COLOR;
		ctx.fillRect(0, 0, cw, ch);
		ctx.fillStyle = DEFAULT_WAITING_COLOR;
		ctx.fillRect(cw, 0, cw, ch);

		img.src = tempCanvas.toDataURL();

		return img;
	}



	global.CPUscheduling.ChartGridArea = ChartGridArea;

})(this);