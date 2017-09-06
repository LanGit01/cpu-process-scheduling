define(function(){

	var Defaults = {
			FONT_SIZE: 12,
			FONT: "monospace",
			CELL_MARGIN: 2,
			GUI_WIDTH: 600,
			GUI_HEIGHT: 400
		};

	
	function GanttChart(chartData, options){
		
	}


	function createConfig(options){
		var c = Object.create(null);

		// Fonts
		c.fontSize = options.fontSize || Defaults.FONT_SIZE;
		c.font = options.font || Defaults.FONT;

		// String Padding
		c.stringVPad = ~~(c.fontSize * 0.2);
		c.stringHPad = ~~(c.fontSize * 0.5);

		// Label Dimensions
		c.rowLabelWidth = options.rowLabelWidth;
	
		// Cell Dimensions
		c.cellWidth = options.cellWidth || options.cellHeight || 0;
		c.cellHeight = options.cellHeight || options.cellWidth || 0;

		// GUI dimensions
		c.guiWidth = options.guiWidth || Defaults.GUI_WIDTH;
		c.guiHeight = options.guiHeight || Defaults.GUI_HEIGHT;

		return c;
	}


	function calculateDimensions(config, rowLabelWidth, colLabelWidth){
		var gridWidth, gridHeight, rowLabelHeight;

		rowLabelWidth += (2 * config.stringHPad);
		colLabelWidth += (2 * config.stringHPad);

		gridWidth = Math.max(config.cellWidth + (2 * Defaults.CELL_MARGIN), colLabelWidth);
		gridHeight = Math.max(config.cellHeight + (2 * Defaults.CELL_MARGIN), config.fontSize + (2 * config.stringVPad));

		if(config.cellWidth === 0 && config.cellHeight === 0){
			gridWidth = gridHeight = rowLabelHeight = colLabelWidth = Math.max(gridWidth, gridHeight);
		}else{
			rowLabelHeight = gridHeight;
		}

		return{
			gridWidth: gridWidth,
			gridHeight: gridHeight,

			rowLabelWidth: Math.max(rowLabelWidth, config.rowLabelWidth),
			rowLabelHeight: rowLabelHeight,

			colLabelWidth: colLabelWidth,
			colLabelHeight: config.fontSize + (2 * config.stringVPad)
		};
		
	}


	return GanttChart;
});