define(["Gui/GanttChart"], function(GanttChart){

	var DRAG_THRESHOLD = 2;

	function MouseDragControl(){
		var isMouseDown = dragged = false,
			xDown = yDown = xDrag = yDrag = 0;

		function mouseDown(x, y){
			xDown = x;
			yDown = y;
			isMouseDown = true;
		}


		function mouseUp(){
			isMouseDown = false;
		}


		function mouseMove(x, y){
			if(isMouseDown && (Math.abs(xDown - x) > DRAG_THRESHOLD || Math.abs(yDown - y) > DRAG_THRESHOLD)){
				xDrag = x;
				yDrag = y;
				dragged = true;
			}
		}


		this.setup = function(addListener){
			addListener(GanttChart.CHART_GRID, "mousedown", mouseDown);
			addListener(GanttChart.CHART_GRID, "mousemove", mouseMove);
			window.addEventListener("mouseup", mouseUp);
		};


		this.cleanup = function(removeListener){
			removeListener(GanttChart.CHART_GRID, "mousedown", mouseDown);
			removeListener(GanttChart.CHART_GRID, "mousemove", mouseMove);
			window.removeEventListener("mouseup", mouseUp);
		};


		this.update = function(chart){
			var offset;
			
			if(dragged){
				offset = chart.getOffset();
				chart.setOffset(offset.x + (xDown - xDrag), offset.y + (yDown - yDrag));
				xDown = xDrag;
				yDown = yDrag;
				dragged = false;
			}
		}
	}


	return MouseDragControl;
});