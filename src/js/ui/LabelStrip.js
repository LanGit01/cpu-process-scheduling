(function(global){

	var Box = global.CPUscheduling.Box;


	/**
	 *	LabelStrip class
	 *
	 *	A rectangular area for labeling rows and columns.
	 *
	 *	The viewable area can be much smaller than the actual strip.
	 *
	 */
	function LabelStrip(x, y, w, h, cw, ch, horizontal){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.cellWidth = cw;
		this.cellHeight = ch;
		this.horizontal = horizontal;

		this._img = null;
		this._numCells = 0;
	}


	LabelStrip.prototype.initializeStripImage = function(labels, font){
		var canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d"),
			cw = this.cellWidth, 
			ch = this.cellHeight,
			x = ~~(cw / 2),
			y = ~~(ch / 2),
			i, horizontal = this.horizontal;

		if(horizontal){
			canvas.width = cw * labels.length;
			canvas.height = ch;
		}else{
			canvas.width = cw;
			canvas.height = ch  * labels.length;
		}

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		for(i = 0; i < labels.length; i++){
			ctx.fillText(labels[i], x, y);

			if(horizontal){
				x += cw;
			}else{
				y += ch;
			}
		}

		this._img = new Image();
		this._img.src = canvas.toDataURL();	
		this._numCells = labels.length;
	}


	LabelStrip.prototype.draw = function(ctx, offset){
		if(this._img === null){
			return;
		}

		// No checks. Assumes passed offset is within bounds.

		var sw = this._img.width, 
			sh = this._img.height;

		if(this.horizontal){
			sw = Math.min(sw - Math.abs(offset), this.w);
			console.log(this._img.width);
			ctx.drawImage(this._img, offset, 0, this.w, this.h, this.x, this.y, this.w, this.h);
		}else{
			sh = Math.min(sh - Math.abs(offset), this.h);
			ctx.drawImage(this._img, 0, offset, this.w, this.h, this.x, this.y, this.w, this.h);
		}
	}

	global.CPUscheduling.LabelStrip = LabelStrip;


})(this);