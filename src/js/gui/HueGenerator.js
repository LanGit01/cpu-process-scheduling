define(["RGB"], function(RGB){

	function HueGenerator(){

	}


	HueGenerator.hslToRgb = hslToRgb;


	function hslToRgb(h, s, l){
		var r, g, b, max, min;

		if(s === 0){
			r = g = b = (l * 255);
			return new RGB(r, g, b); 
		}else{
			if(l < 0.5){
				max = l * (s + 1);
			}else{
				max = (l + s) - (l * s);
			}

			min = (2 * l) - max;
		}

		r = Math.floor(255 * hueToRgb(h + (1/3), max, min));
		g = Math.floor(255 * hueToRgb(h, max, min));
		b = Math.floor(255 * hueToRgb(h - (1/3), max, min));
		
		return new RGB(r, g, b);
	}


	function hueToRgb(hue, max, min){
		if(hue < 0){
			hue += 1;
		}else
		if(hue > 1){
			hue -= 1;
		}

		hue *= 6;

		if(hue < 1){
			return (hue * (max - min)) + min; 	// Q1 -> [0, 1) -> secondary		
		}else
		if(hue < 3){
			return max;		// Q2 + Q3 -> [1, 3) -> max
		}else
		if(hue < 4){
			return ((4 - hue) * (max - min) + min);		// Q4 -> [3, 4) -> secondary
		}

		return min; // Q5 + Q6 -> [4, 6) -> min
	}

	return HueGenerator;
});