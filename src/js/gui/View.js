define(function(){

	function View(component, x, y, w, h){
		this.setPosition(x, y);
		this.resize(w, h);
		this.setComponent(component);
		this.setOffset(0, 0);
	}


	View.prototype = {
		constructor: View,

		setComponent: function(component){
			this.component = component;
			if(component){
				this._componentWidth = component.getWidth();
				this._componentHeight = component.getHeight();
			}
			return this;
		},

		setPosition: function(x, y){
			this._x = x;
			this._y = y;
			return this;
		},

		resize: function(w, h){
			this._w = w;
			this._h = h;
			return this;
		},

		setOffset: function(x, y){
			if(!this.component) return this;

			if(x < 0) x = 0;
			if(y < 0) y = 0;

			this._xOffset = Math.min(x, Math.max(0, this._componentWidth - this._w));
			this._yOffset = Math.min(y, Math.max(0, this._componentHeight - this._h));

			return this;
		},

		draw: function(ctx){
			if(this.component){
				this.component.draw(ctx, this._x, this._y, this._w, this._h, this._xOffset, this._yOffset);	
			}

			return this;
		}
	};


	return View;
});