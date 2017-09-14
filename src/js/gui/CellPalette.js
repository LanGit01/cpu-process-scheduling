define(function(){

	function CellPalette(numDistinct, width, height, bevel){
		
	}



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

		document.body.appendChild(canvas);
		
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

	createCell(40, 40, 4, "#666666", "#aaaaaa", "#222222");

	return CellPalette;
});