define(["Gui/HueGenerator"], function(HueGenerator){

	var FLAT = 0,
		RAISED = 1,
		BASE_SATURATION = 0.55,
		BASE_LIGHTNESS = 0.6;


	/**
	 *	Constructor: CellPalette
	 *
	 *	Creates pre-rendered Gantt Chart grid cell images.
	 *	Generates `numDistinct` number of cells for each type: FLAT, RAISED. RAISED cells have
	 *	a bevel on the edges, while FLAT does not.
	 *
	 *	@param {int} numDistinct - number of cells to create for each type
	 *	@param {int} width - width of a cell
	 *	@param {int} height - height of a cell
	 *	@param {int} bevel - width of the bevel for RAISED cells
	 */
	function CellPalette(numDistinct, width, height, bevel){
		var hueGenerator = new HueGenerator(),
			colors, i;

		hueGenerator.addChroma("base", BASE_SATURATION, BASE_LIGHTNESS);
		hueGenerator.addChroma("light", BASE_SATURATION, BASE_LIGHTNESS + 0.17);
		hueGenerator.addChroma("dark", BASE_SATURATION, BASE_LIGHTNESS - 0.17);
		hueGenerator.addChroma("greyed", BASE_SATURATION * 0.4, BASE_LIGHTNESS);

		colors = hueGenerator.generateColors(numDistinct);

		this._cells = [];

		for(i = 0; i < numDistinct; i++){
			this._cells.push([
				createCell(width, height, bevel, colors.greyed[i]),
				createCell(width, height, bevel, colors.base[i], colors.light[i], colors.dark[i]),
			]);
		}
	}


	CellPalette.FLAT = FLAT;
	CellPalette.RAISED = RAISED;


	CellPalette.prototype = {
		constructor: CellPalette,

		getNumCells: function(){
			return this._cells.length;
		},

		/**
		 *	@param index
		 *	@param type
		 *	@return {HTMLCanvasElement} - the cell image
		 */
		getCell: function(index, type){
			if(index < 0 || index > this._cells.length - 1){
				return null;
			}

			return this._cells[index][type];
		}
	};

	/**
	 *	@param {int} width - width of the cell
	 *	@param {int} height - height of the cell
	 *	@param {int} bevel - width of the bevel
	 *	@param cBase - a CSS color specifying the base color of the cell
	 *	@param cLight - a CSS color specifying the color of the lighter bevel edge
	 *	@param cDark - a CSS color specifying the color of the darker bevel edge
	 *	@return {HTMLCanvasElement} - the cell image
	 */
	function createCell(width, height, bevel, cBase, cLight, cDark){
		var canvas = createCanvas(width, height),
			ctx = canvas.getContext("2d");

		if(!cDark){
			cDark = cLight || null;
		}

		// Base color
		ctx.fillStyle = cBase;

		if(!cLight && !cDark){
			ctx.fillRect(0, 0, width, height);
		}else{
			ctx.fillRect(bevel, bevel, width - bevel, height - bevel);	

			fillCorner(ctx, cDark, width, height, bevel);

			ctx.translate(width / 2, height / 2);
			ctx.rotate(Math.PI);
			ctx.translate(-(width / 2), -(height / 2));
			
			fillCorner(ctx, cLight, width, height, bevel);
		}
		
		return canvas;
	}


	function fillCorner(ctx, color, w, h, bevel){
		ctx.fillStyle = color;
		
		ctx.beginPath();
		ctx.moveTo(0, h);
		ctx.lineTo(w, h);
		ctx.lineTo(w, -1);
		ctx.lineTo(w - bevel, bevel - 1);
		ctx.lineTo(w - bevel, h - bevel);
		ctx.lineTo(bevel, h - bevel);
		ctx.closePath();
		
		ctx.fill();
	}


	function createCanvas(width, height){
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	}


	return CellPalette;
});