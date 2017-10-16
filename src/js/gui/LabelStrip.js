define(function(){

	var LabelStripFactory = {
		horizontalStrip: function(strArr, font, lw, lh, hPad, vPad){
			return new LabelStrip(strArr, font, lw, lh, hPad, vPad, true);
		},

		verticalStrip: function(strArr, font, lw, lh, hPad, vPad){
			return new LabelStrip(strArr, font, lw, lh, hPad, vPad, false);
		},
	};

	/**
	 *	Renders an array of labels horizontally(left-to-right) or vertically(top-to-bottom)
	 *
	 *	@param {Array<String>} strArr - the array of labels to render
	 *	@param font - CSS font to use
	 *	@param labelWidth - width of a label
	 *	@param labelHeight - height of a label
	 *	@param hPad - amount of left/right padding
	 *	@param vPad - amount of top/bottom padding
	 *	@param {boolean} horizontal - render the labels horizontally if true, vertically if false
	 */
	function LabelStrip(strArr, font, labelWidth, labelHeight, hPad, vPad, horizontal){
		var hAlignObj = findAlignment(hPad, labelWidth, "left", "center", "right"),
			vAlignObj = findAlignment(vPad, labelHeight, "top", "middle", "bottom");

		this._canvas = createCanvas(strArr.length, labelWidth, labelHeight, horizontal);

		renderStrip(
			initContext(this._canvas, font, hAlignObj.align, vAlignObj.align),
			strArr, labelWidth, labelHeight, hAlignObj.offset, vAlignObj.offset, horizontal
		);
	}


	LabelStrip.prototype = {
		constructor: LabelStrip,

		getSize: function(){
			return {
				w: this._canvas.width,
				h: this._canvas.height 
			};
		},

		getWidth: function(){
			return this._canvas.width;
		},

		getHeight: function(){
			return this._canvas.height;
		},

		draw: function(ctx, screenRect, xOffset, yOffset){
			ctx.clearRect(screenRect.x, screenRect.y, screenRect.w, screenRect.h);
			screenRect.w = Math.min(this.getWidth() - xOffset, screenRect.w);
			screenRect.h = Math.min(this.getHeight() - yOffset, screenRect.h);
			ctx.drawImage(this._canvas, xOffset, yOffset, screenRect.w, screenRect.h, screenRect.x, screenRect.y, screenRect.w, screenRect.h);
		}
	};
	

	function createCanvas(numLabels, cellWidth, cellHeight, horizontal){
		var c = document.createElement("canvas");
		c.width = (horizontal ? cellWidth * numLabels : cellWidth);
		c.height = (horizontal ? cellHeight : cellHeight * numLabels);
		return c;
	}


	function initContext(canvas, font, hAlign, vAlign){
		var ctx = canvas.getContext("2d");
		ctx.font = font;
		ctx.textAlign = hAlign;
		ctx.textBaseline = vAlign;
		return ctx;
	}


	function findAlignment(pad, bound, low, mid, high){
		if(pad === null){
			align = mid;
			pad = Math.floor(bound / 2);
		}else{
			if(pad < 0){
				align = high;
				pad = bound + pad + 1;
			}else{
				align = low;
			}
		}

		return {
			align: align,
			offset: pad
		};
	}


	function renderStrip(ctx, strArr, labelWidth, labelHeight, xOffset, yOffset, horizontal){
		var xStep = labelWidth * (horizontal ? 1 : 0),
			yStep = labelHeight * (horizontal ? 0 : 1),
			i;

		for(i = 0; i < strArr.length; i++){
			ctx.fillText(strArr[i], xOffset, yOffset);
			xOffset += xStep;
			yOffset += yStep;
		}

		return ctx;
	}


	return LabelStripFactory;
});