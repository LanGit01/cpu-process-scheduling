define(function(){

	function Rect(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}


	Rect.prototype = {
		constructor: Rect,

		pointInRect: function(x, y){
			return !(x < this.x || x > this.x + this.w - 1 || y < this.y || y > this.y + this.h - 1);
		},

		intersection: function(other){

		},

		clone: function(){
			return new Rect(this.x, this.y, this.w, this.h);
		}
	};


	return Rect;
});