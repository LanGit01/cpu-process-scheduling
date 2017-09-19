define(["Gui/CellPalette"], function(CellPalette){

	function ChartGrid(chartData, gridWidth, gridHeight, cellMargin, bgColor){
		this._chartData = chartData;
		this._ids = chartData.getIDs();

		this._numCols = chartData.getNumLogs();
		this._numRows = this._ids.length;

		this._gridWidth = gridWidth;
		this._gridHeight = gridHeight;

		this._width = this._numCols * gridWidth;
		this._height = this._numRows * gridWidth;

		this._cellWidth = gridWidth - (cellMargin * 2);
		this._cellHeight = gridHeight - (cellMargin * 2);

		this._cellMargin = cellMargin;

		this._cellPalette = new CellPalette(this._numRows, this._cellWidth, this._cellHeight, 4);
	}


	ChartGrid.prototype = {
		constructor: ChartGrid,

		getWidth: function(){
			return this._width;
		},

		getHeight: function(){
			return this._height;
		},

		draw: function(ctx, xScreen, yScreen, wScreen, hScreen, xOffset, yOffset){
			var rowRange, colRange, running, waiting, xDrawArea, yDrawArea, imgClip;

			rowRange = gridRange(this._gridHeight, yOffset, hScreen);
			colRange = gridRange(this._gridWidth, xOffset, wScreen);

			for(col = colRange.start; col <= colRange.end; col++){
				xDrawArea = (col * this._gridWidth) - xOffset + this._cellMargin;
				
				running = this._chartData.getRunning(col);
				waiting = this._chartData.getWaiting(col);

				row = getRowWithinBounds(this._ids, running, rowRange);
				if(row !== null){
					yDrawArea = (row * this._gridHeight) - yOffset + this._cellMargin;
					console.log(xDrawArea, yDrawArea, this._cellWidth, this._cellHeight, wScreen, hScreen);
				}
			}
		}
	};

	// drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
	// xScreen = x + (col * this._gridWidth) - xOffset + this._cellMargin
	function cellClipVisible(x, y, cellWidth, cellHeight, screenWidth, screenHeight){
		return {
			x: (x < 0 ? -x : 0),
			y: (y < 0 ? -y : 0),
			w: Math.min(screenWidth - x, cellWidth),
			h: Math.min(screenHeight - y, cellHeight)
		};
	}


	function gridRange(gridSize, offset, screenSize){
		return{
			start: ~~(offset / gridSize),
			end: ~~((offset + screenSize) / gridSize)
		};
	}

	
	function getRowWithinBounds(ids, cellData, range){
		if(!cellData){
			return null;
		}

		var row = ids.indexOf(cellData.id);
		if(row >= range.start && row <= range.end){
			return row;
		}

		return null;
	}




	return ChartGrid;
});