define(["Gui/Rect"], function(Rect){

	function View(component, x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
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
			//ctx.strokeRect(this._rect.x + 0.5, this._rect.y + 0.5, this._rect.w, this._rect.h);
		if(this.component){
			this.component.draw(ctx, this.clone(), this._xOffset, this._yOffset);	
		}

		return this;
	};


	return View;
});