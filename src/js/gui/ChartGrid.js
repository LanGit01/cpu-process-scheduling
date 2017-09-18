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

		draw: function(ctx, x, y, w, h, xOffset, yOffset){
			var rowStart, rowEnd, colStart, colEnd,
				x, y, row, col, running, waiting, i;

			// Range of visible grid cells
			rowStart = ~~(yOffset / this._gridHeight);
			rowEnd = ~~((yOffset + h - 1) / this._gridHeight);
			colStart = ~~(xOffset / this._gridWidth);
			colEnd = ~~((xOffset + w - 1) / this._gridWidth);

			// Draw cells
			for(col = colStart; col <= colEnd; col++){
				x = (col * this._gridWidth) - xOffset + this._cellMargin;

				running = this._chartData.getRunning(col);
				waiting = this._chartData.getWaiting(col);

				// Draw running
				row = running && this._ids.indexOf(running.id);
				if(row && row >= rowStart && row <= rowEnd){
					// draw running
					y = (row * this._gridHeight) - yOffset + this._cellMargin;
					console.log(this._cellMargin);
					ctx.drawImage(this._cellPalette.getCell(running.id, CellPalette.RAISED), x, y);
				}

				for(i = 0; i < waiting.length; i++){
					row = this._ids.indexOf(waiting[i].id);
					if(row > rowStart && row < rowEnd){
						// draw waiting
						y = (row * this._gridHeight) - yOffset + this._cellMargin;
						ctx.drawImage(this._cellPalette.getCell(waiting[i].id, CellPalette.FLAT), x, y);
					}
				}
			}
		}
	};

	return ChartGrid;
});