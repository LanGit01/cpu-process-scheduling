define(["Gui/RGB"], function(RGB){

	var GOLDEN_RATIO = 1.61803398875;

	/**
	 *	Constructor: HueGenerator
	 *
	 *	Generates color sets, where each set is a sequence of colors which has a single chroma, and
	 *	the adjacent colors' hues are sufficiently distinct.
	 *
	 *	To create the color sets, a sequence of hue is generated and is applied to user-provided chromas.
	 */
	function HueGenerator(){
		this._chromas = Object.create(null);	// Change to {}
	}


	HueGenerator.hslToRgb = hslToRgb;


	HueGenerator.prototype = {
		constructor: HueGenerator,

		/**
		 *	Add a fixed chroma to which the generated hues will be applied.
		 *
		 *	@param chromaId - id of the fixed chroma, used when removing the chroma, also
		 *					  used as the property name of the color set from the object returned
		 *					  by `generateColors`.
		 */
		addChroma: function(chromaId, saturation, lightness){
			this._chromas[chromaId] = {
				s: saturation,
				l: lightness
			};
		},

		removeChroma: function(chromaId){
			var chroma = this._chromas[chromaId] || null;
			delete this._chromas[chromaId];
			return chroma;
		},

		/**
		 *	Generate color sets from the provided chromas.
		 *
		 *	An object map containing the generated color sets is returned. A color set for a chroma is an array 
		 *	referenced by a property in the object. The property name for a color set is the `chromaId` used to 
		 *	register a chroma in the `addChroma` method.
		 *
		 *	@param numColors - number of colors to generate for each set
		 *	@param startHue - a number from [0, 1] that specifies the starting hue
		 *	@return {Object<Array>} - object map containing the color sets
		 */
		generateColors: function(numColors, startHue){
			var i, id, hue, colors = {}, chromas = this._chromas;

			hue = startHue || 0;

			for(id in chromas){
				colors[id] = [];
			}

			for(i = 0; i < numColors; i++){
				for(id in colors){
					colors[id].push(hslToRgb(hue, chromas[id].s, chromas[id].l));
				}
				hue = (hue + GOLDEN_RATIO) % 1;
			}

			return colors;
		}
	};


	/**
	 *	Function: hslToRgb
	 *
	 *	Converts from HSL color space to RGB. The range of Hue, Saturation, and Lightness is [0, 1]
	 *	
	 *	@param h - hue
	 *	@param s - saturation
	 *	@param l - lightness
	 *	@return {RGB} - an RGB object representing the converted value
	 */
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


	/**
	 *	Function: hueToRgb
	 *
	 *	A helper function to `hslToRgb`. Converts a hue value to it's corresponding
	 *	RGB value, given the `max` and the `min`.
	 *
	 *	@param max - maximum of the values of the 3 RGB channels
	 *	@param min - minimum of the values of the 3 RGB channels
	 *	@return an RGB channel value from [0, 1]
	 */
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