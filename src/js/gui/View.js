define(function(){

	function View(component, x, y, w, h){
		this.component = component;

		this.setPosition(x, y);
		this.resize(w, h);
		this.setOffset(0, 0);
	}


	View.prototype = {
		constructor: View,

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
			this._xOffset = x;
			this._yOffset = y;
			return this;
		},

		draw: function(ctx){
			ctx.strokeRect(this._x, this._y, this._w, this._h);
			this.component.draw(ctx, this._x, this._y, this._w, this._h, this._xOffset, this._yOffset);
		}
	};


	return View;
});