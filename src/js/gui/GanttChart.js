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
		c.stringHPad = c.fontSize;

		// Label Dimensions
		c.rowLabelWidth = options.rowLabelWidth;
		//c.colLabelWidth = 40;

		// GUI dimensions
		c.guiWidth = options.guiWidth || Defaults.GUI_WIDTH;
		c.guiHeight = options.guiHeight || Defaults.GUI_HEIGHT;

		return c;
	}


	return GanttChart;
});