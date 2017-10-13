define(function(){

	function TestControl(){
		var x = y = 0;


		function capturePoint(ex, ey){
			x = ex;
			y = ey;
		}

		this.setup = function(addEventListener){
			addEventListener(1, "click", capturePoint);
		};

		this.cleanup = function(removeEventListener){

		};

		this.update = function(ganttChart){
			console.log(x, y);
		};

	}

	return TestControl;
});