define(["Gui/View", "Gui/LabelStrip", "Gui/ChartGrid"], function(View, LabelStrip, ChartGrid){

	var Defaults = {
			FONT_SIZE: 18,
			FONT: "monospace",
			CELL_MARGIN: 2,
			GUI_WIDTH: 600,
			GUI_HEIGHT: 400,
			LABEL_HPAD_MIN: 4,
			LABEL_VPAD_MIN: 4,
		};

	
	function GanttChart(chartData, options){
		var config = createConfig(options),
			ids, timeLabels, font;

		this._canvas = document.createElement("canvas");
		this._ctx = this._canvas.getContext("2d");

		font = config.fontSize + "px " + config.font;
		ids = chartData.getIDs();
		timeLabels = fillArrayIncremental(chartData.getNumLogs());

		dimensions = calculateComponentDimensions(config,
			labelMinSize(this._ctx, config, ids),
			labelMinSize(this._ctx, config, timeLabels)
		);

		this._canvas.width = config.guiWidth;
		this._canvas.height = config.guiHeight;

		this._idLabelView = new View(
			LabelStrip.verticalStrip(ids, font, dimensions.rowLabel.w, dimensions.rowLabel.h, null, null), 
			0, dimensions.colLabel.h, dimensions.rowLabel.w, config.guiHeight - dimensions.colLabel.h
		);
		this._timeLabelView = new View(
			LabelStrip.horizontalStrip(timeLabels, font, dimensions.colLabel.w, dimensions.colLabel.h, null, null),
			dimensions.rowLabel.w, 0, config.guiWidth - dimensions.rowLabel.w, dimensions.colLabel.h
		);

		this._chartGrid = new ChartGrid(chartData, dimensions.grid.w, dimensions.grid.h, 2);
		this._chartGridView = new View(this._chartGrid, dimensions.rowLabel.w, dimensions.colLabel.h, config.guiWidth - dimensions.rowLabel.w, config.guiHeight - dimensions.colLabel.h);
		document.body.appendChild(this._canvas);
		this._draw();
	}


	GanttChart.prototype = {
		constructor: ChartGrid,

		_draw: function(){
			this._idLabelView.draw(this._ctx);
			this._timeLabelView.draw(this._ctx);
			this._chartGridView.draw(this._ctx);
		}
	};



	//	Values required to create chart:
	//	- Font
	//	- Gui dimensions
	//	- Grid dimensions

	/*============================================*\
			Initialization helper functions
	\*============================================*/

	function createConfig(options){
		var c = {};

		options = options || {};

		c.fontSize = options.fontSize || Defaults.FONT_SIZE;
		c.font = options.font || Defaults.FONT;

		c.cellWidth = options.cellWidth || 0;
		c.cellHeight = options.cellHeight || 0;

		c.guiWidth = options.guiWidth || Defaults.GUI_WIDTH;
		c.guiHeight = options.guiHeight || Defaults.GUI_HEIGHT;

		c.labelHPad = Math.max(c.fontSize * 0.5, Defaults.LABEL_HPAD_MIN);
		c.labelVPad = Math.max(c.fontSize * 0.25, Defaults.LABEL_VPAD_MIN);

		return c;
	}


	function labelMinSize(ctx, config, labels){
		var prevFont = ctx.font, textWidth, size;

		ctx.font = config.fontSize + "px " + config.font;

		size = {
			w: (config.labelHPad * 2) + maxStringWidth(ctx, labels),
			h: (config.labelVPad * 2) + (config.fontSize * 1.25)
		};

		ctx.font = prevFont;
		return size;
	}


	function calculateComponentDimensions(config, rowLabelSize, colLabelSize){
		/*
			Both cell dimensions given:
				adjust cell dimensions based on label dimensions

			One cell dimension given (ex. width):
				adjust cell dimensions based on label dimensions

			No cell dimensions given:
				adjust label dimensions so that cell is square
				set cell dimensions
		*/
		var gridWidth, gridHeight;

		if(config.cellWidth === 0 && config.cellHeight === 0){
			gridWidth = gridHeight = Math.max(colLabelSize.w, rowLabelSize.h);
		}else{
			gridWidth = Math.max(colLabelSize.w, config.cellWidth + (2 * Defaults.CELL_MARGIN));
			gridHeight = Math.max(rowLabelSize.h, config.cellHeight + (2 * Defaults.CELL_MARGIN));
		}

		return {
			rowLabel: {
				w: rowLabelSize.w,
				h: gridHeight
			},

			colLabel: {
				w: gridWidth,
				h: colLabelSize.h
			},

			grid: {
				w: gridWidth,
				h: gridHeight
			}
		};
	}



	function maxStringWidth(ctx, strArr){
		return ~~strArr.reduce(function(max, str){
			var width = ctx.measureText(str).width;
			return (width > max ? width : max);
		}, 0);
	}


	function fillArrayIncremental(n){
		var arr = [], i;

		for(i = 0; i < n; i++){
			arr[i] = i;
		}

		return arr;
	}


	function dimension(w, h){
		return {
			w: w,
			h: h
		};
	}

	return GanttChart;
});