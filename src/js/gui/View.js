define(["Gui/Rect"], function(Rect){

	function View(component, x, y, w, h, borderWidth, borderColor){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		this.setBorder(borderWidth, borderColor);
		this.setComponent(component);
	}


	View.subclass(Rect);


	View.prototype.setComponent = function(component){
		this.component = component;
		if(component){
			this._componentWidth = component.getWidth();
			this._componentHeight = component.getHeight();
		}
		this.setOffset(0, 0);
		return this;
	};


	View.prototype.setPosition = function(x, y){
		this.x = x;
		this.y = y;
		return this;
	};

	
	View.prototype.setBorder = function(width, color){
		this._borderWidth = width || 0;
		this._borderColor = color || null;
		return this;
	};


	View.prototype.resize = function(w, h){
		this.w = w;
		this.h = h;
		return this;
	};


	View.prototype.setOffset = function(x, y){
		if(!this.component) return this;

		if(x < 0) x = 0;
		if(y < 0) y = 0;

		this._xOffset = Math.min(x, Math.max(0, this._componentWidth - this.w));
		this._yOffset = Math.min(y, Math.max(0, this._componentHeight - this.h));

		return this;
	};

	View.prototype.draw =  function(ctx){
		var rect;

		if(this._borderWidth && this._borderColor){
			drawBorder(ctx, this, this._borderWidth, this._borderColor);
		}

		if(this.component){
			rect = this.clone();
			rect.x += this._borderWidth;
			rect.y += this._borderWidth;
			rect.w -= (2 * this._borderWidth);
			rect.h -= (2 * this._borderWidth);
			this.component.draw(ctx, rect, this._xOffset, this._yOffset);	
		}
	};


	function drawBorder(ctx, rect, borderSize, color){
		var prevStrokeStyle, prevLineWidth,
			translate = (borderSize % 2 === 0 ? 0 : 0.5),
			half = ~~(borderSize / 2);

		// Save previous
		prevStrokeStyle = ctx.strokeStyle;
		prevLineWidth = ctx.lineWidth;

		ctx.strokeStyle = color;
		ctx.lineWidth = borderSize;
		ctx.strokeRect(rect.x + half + translate, rect.y + half + translate, rect.w - borderSize, rect.h - borderSize);

		// Restore previous
		ctx.strokeStyle = prevStrokeStyle;
		ctx.lineWidth = prevLineWidth;
	}


	return View;
});