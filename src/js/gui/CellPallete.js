define(function(){

	function CellPallete(numDistinct, width, height, bevel){
		
	}



	function createCell(width, height, bevel, cLow, cMid, cHigh){
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d"),
			right, bottom, i;

		canvas.width = width;
		canvas.height = height;

		// Base color
		
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, width, height);
		ctx.fillRect(bevel, bevel, width - bevel, height - bevel);

		
		fillCorner(ctx, cLow, width, height, bevel);

		ctx.translate(width / 2, height / 2);
		ctx.rotate(Math.PI);
		ctx.translate(-(width / 2), -(height / 2));
		
		fillCorner(ctx, cHigh, width, height, bevel);
		
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

	return CellPallete;
});