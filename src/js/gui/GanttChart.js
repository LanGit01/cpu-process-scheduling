define(["Gui/View", "Gui/LabelStrip", "Gui/ChartGrid", "Gui/Rect"], function(View, LabelStrip, ChartGrid, Rect){

	var Defaults = {
			FONT_SIZE: 18,
			FONT: "monospace",
			CELL_MARGIN: 2,
			GUI_WIDTH: 600,
			GUI_HEIGHT: 400,
			LABEL_HPAD_MIN: 4,
			LABEL_VPAD_MIN: 4,
		};

	var CHART_GRID = 1,
		ROW_LABELS = 2,
		COLUMN_LABELS = 3,
		CANVAS = 4;

	var componentIds = [CHART_GRID, ROW_LABELS, COLUMN_LABELS];

	// Note: GUI window width/height should not be auto-generated
	// I plan to make this class independent of DOM

	
	function GanttChart(chartData, options){
		var config = createConfig(options),
			ids, timeLabels, font;

		font = config.fontSize + "px " + config.font;
		ids = chartData.getIDs();
		timeLabels = fillArrayIncremental(chartData.getNumLogs());

		this._canvas = document.createElement("canvas");
		this._ctx = this._canvas.getContext("2d");
		this._canvas.width = config.guiWidth;
		this._canvas.height = config.guiHeight;
		
		dim = calculateComponentDimensions(config,
			labelMinSize(this._ctx, config, ids),
			labelMinSize(this._ctx, config, timeLabels)
		);

				
		// Create Components
		this._components = {};
		this._components[ROW_LABELS] = new View(
			LabelStrip.verticalStrip(ids, font, dim.rowLabel.w, dim.rowLabel.h, null, null), 
			0, dim.colLabel.h, dim.rowLabel.w, config.guiHeight - dim.colLabel.h
		);
		this._components[COLUMN_LABELS] = new View(
			LabelStrip.horizontalStrip(timeLabels, font, dim.colLabel.w, dim.colLabel.h, null, null),
			dim.rowLabel.w, 0, config.guiWidth - dim.rowLabel.w, dim.colLabel.h
		);
		this._chartGrid = new ChartGrid(chartData, dim.grid.w, dim.grid.h, 2);
		this._components[CHART_GRID] = new View(this._chartGrid, dim.rowLabel.w, dim.colLabel.h, config.guiWidth - dim.rowLabel.w, config.guiHeight - dim.colLabel.h);	
	}


	GanttChart.CHART_GRID = CHART_GRID;
	GanttChart.ROW_LABELS = ROW_LABELS;
	GanttChart.COLUMN_LABELS = COLUMN_LABELS;
	

	GanttChart.prototype = {
		constructor: ChartGrid,

		CHART_GRID: CHART_GRID,
		ROW_LABELS: ROW_LABELS,
		COLUMN_LABELS: COLUMN_LABELS,

		getCanvas: function(){
			return this._canvas;
		},

		getComponentRect: function(componentId){
			if(!(componentId in this._components)) return null; // Throw error maybe

			var component = this._components[componentId];
			return Rect.prototype.clone.call(component);
		},

		setOffset: function(x, y){
			for(var i = 0; i < componentIds.length; i++){
				this._components[componentIds[i]].setOffset(x, y);
			}
		},

		draw: function(){
			for(var i = 0; i < componentIds.length; i++){
				this._components[componentIds[i]].draw(this._ctx);
			}
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