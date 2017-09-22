define(["Gui/Rect"], function(Rect){

	function View(component, x, y, w, h){
		this._rect = new Rect(x, y, w, h);

		this.setComponent(component);
	}


	View.prototype = {
		constructor: View,

		setComponent: function(component){
			this.component = component;
			if(component){
				this._componentWidth = component.getWidth();
				this._componentHeight = component.getHeight();
			}
			this.setOffset(0, 0);
			return this;
		},

		setPosition: function(x, y){
			this._rect.x = x;
			this._rect.y = y;
			return this;
		},

		getRect: function(){
			return this._rect;
		},

		resize: function(w, h){
			this._rect.w = w;
			this._rect.h = h;
			return this;
		},

		setOffset: function(x, y){
			if(!this.component) return this;

			if(x < 0) x = 0;
			if(y < 0) y = 0;

			this._xOffset = Math.min(x, Math.max(0, this._componentWidth - this._rect.w));
			this._yOffset = Math.min(y, Math.max(0, this._componentHeight - this._rect.h));

			return this;
		},

		draw: function(ctx){
			ctx.strokeRect(this._rect.x + 0.5, this._rect.y + 0.5, this._rect.w, this._rect.h);
			if(this.component){
				this.component.draw(ctx, this._rect.clone(), this._xOffset, this._yOffset);	
			}

			return this;
		}
	};


	return View;
});