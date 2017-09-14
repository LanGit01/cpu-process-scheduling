define(["HueGenerator"], function(HueGenerator){

	var FLAT = 0,
		RAISED = 1,
		BASE_SATURATION = 0.7,
		BASE_LIGHTNESS = 0.5;

	function CellPalette(numDistinct, width, height, bevel){
		var hueGenerator = new HueGenerator(),
			colors, i;

		hueGenerator.addChroma("base", BASE_SATURATION, BASE_LIGHTNESS);
		hueGenerator.addChroma("light", BASE_SATURATION, BASE_LIGHTNESS + 0.2);
		hueGenerator.addChroma("dark", BASE_SATURATION, BASE_LIGHTNESS - 0.2);

		colors = hueGenerator.generateColors(numDistinct);

		this._cells = [];

		for(i = 0; i < numDistinct; i++){
			this._cells.push([
				createCell(width, height, bevel, colors.base[i]),
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

		getCell: function(index, type){
			if(index < 0 || index > this._cells.length - 1){
				return null;
			}

			return this._cells[index][type];
		}
	};


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