(function(global){



	function Dimensions(w, h){
		this.w = w;
		this.h = h;
	}


	function Box(x, y, w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}


	global.CPUscheduling.Dimensions = Dimensions;
	global.CPUscheduling.Box = Box;

})(this);