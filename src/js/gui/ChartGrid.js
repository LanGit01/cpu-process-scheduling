define(["Gui/CellPalette", "Gui/Rect"], function(CellPalette, Rect){

	function ChartGrid(chartData, gridWidth, gridHeight, cellMargin, bgColor){
		this._chartData = chartData;
		this._ids = chartData.getIDs();

		this._numCols = chartData.getNumLogs();
		this._numRows = this._ids.length;

		this._gridWidth = gridWidth;
		this._gridHeight = gridHeight;

		this._chartDimensions = new Rect(0, 0, this._numCols * gridWidth, this._numRows * gridHeight);

		this._cellDimensions = new Rect(0, 0, gridWidth - (cellMargin * 2), gridHeight - (cellMargin * 2));
		this._cellMargin = cellMargin;

		this._cellPalette = new CellPalette(this._numRows, this._cellDimensions.w, this._cellDimensions.h, 4);
	}


	ChartGrid.prototype = {
		constructor: ChartGrid,

		getWidth: function(){
			return this._chartDimensions.w;
		},

		getHeight: function(){
			return this._chartDimensions.h;
		},

		draw: function(ctx, screenRect, xOffset, yOffset){
			var rowRange, colRange, running, waiting, i,
				cellMargin = this._cellMargin,
				cellRect = this._cellDimensions.clone();

			rowRange = gridRange(this._gridHeight, yOffset + cellMargin, screenRect.h - cellMargin - 1);
			colRange = gridRange(this._gridWidth, xOffset + cellMargin, screenRect.w - cellMargin - 1);

			for(col = colRange.start; col <= colRange.end; col++){
				cellRect.x = (col * this._gridWidth) - xOffset + cellMargin;

				running = this._chartData.getRunning(col);
				waiting = this._chartData.getWaiting(col);

				// Draw running cell if one is visible
				row = getRowWithinBounds(this._ids, running, rowRange);
				if(row !== null){
					cellRect.y = (row * this._gridHeight) - yOffset + cellMargin;
					drawCell(ctx, this._cellPalette.getCell(row, CellPalette.RAISED), screenRect, cellRect);
				}

				// Draw waiting cells if visible
				for(i = 0; i < waiting.length; i++){
					row = getRowWithinBounds(this._ids, waiting[i], rowRange);
					if(row !== null){
						cellRect.y = (row * this._gridHeight) - yOffset + cellMargin;
						drawCell(ctx, this._cellPalette.getCell(row, CellPalette.FLAT), screenRect, cellRect);
					}
				}
			}
		}
	};


	function drawCell(ctx, cellImage, screenRect, cellRect){
		var x = Math.max(cellRect.x, 0),
			y = Math.max(cellRect.y, 0),
			imgClip = cellClipVisible(cellRect, screenRect);

		ctx.drawImage(cellImage, imgClip.x, imgClip.y, imgClip.w, imgClip.h, screenRect.x + x, screenRect.y + y, imgClip.w, imgClip.h);
	}


	function cellClipVisible(cellRect, screenRect){
		var x = (cellRect.x < 0 ? -cellRect.x : 0),
			y = (cellRect.y < 0 ? -cellRect.y : 0);

		return new Rect(
			x, y,
			Math.min(screenRect.w - cellRect.x, cellRect.w - x),
			Math.min(screenRect.h - cellRect.y, cellRect.h - y)
		);
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