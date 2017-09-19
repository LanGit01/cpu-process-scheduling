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
			var rowRange, colRange, running, waiting, imgClipRect, i, cellData,
				cellMargin = this._cellMargin,
				cellRect = this._cellDimensions.clone();

			rowRange = gridRange(this._gridHeight, yOffset + cellMargin, screenRect.h - cellMargin - 1);
			colRange = gridRange(this._gridWidth, xOffset + cellMargin, screenRect.w - cellMargin - 1);

			for(col = colRange.start; col <= colRange.end; col++){
				cellRect.x = (col * this._gridWidth) - xOffset + cellMargin;

				running = this._chartData.getRunning(col);
				waiting = this._chartData.getWaiting(col);


				row = getRowWithinBounds(this._ids, running, rowRange);
				if(row !== null){
					cellRect.y = (row * this._gridHeight) - yOffset + cellMargin;
					imgClipRect = cellClipVisible(cellRect, screenRect);
					drawCell(ctx, screenRect.x + cellRect.x, screenRect.y + cellRect.y, this._cellPalette.getCell(running.id, CellPalette.RAISED), imgClipRect);
				}

				for(i = 0; i < waiting.length; i++){
					cellData = waiting[i];
					row = getRowWithinBounds(this._ids, cellData, rowRange);
					if(row !== null){
						cellRect.y = (row * this._gridHeight) - yOffset + cellMargin;
						imgClipRect = cellClipVisible(cellRect, screenRect);
						drawCell(ctx, screenRect.x + cellRect.x, screenRect.y + cellRect.y, this._cellPalette.getCell(cellData.id, CellPalette.FLAT), imgClipRect);
					}
				}
			}
		}
	};


	function drawCell(ctx, x, y, cellImage, cellClip){
		ctx.drawImage(cellImage, cellClip.x, cellClip.y, cellClip.w, cellClip.h, x, y, cellClip.w, cellClip.h);
	}


	function cellClipVisible(cellRect, screenRect){
		return new Rect(
			(cellRect.x < 0 ? -cellRect.x : 0),
			(cellRect.y < 0 ? -cellRect.y : 0),
			Math.min(screenRect.w - cellRect.x, cellRect.w),
			Math.min(screenRect.h - cellRect.y, cellRect.h)
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