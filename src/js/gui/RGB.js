define(function(){

	function RGB(r, g, b){
		if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255){
			throw new RangeError("RGB values must be within 0 to 255");
		}

		this.r = r;
		this.g = g;
		this.b = b;
	}


	RGB.prototype = {
		constructor: RGB,

		toHexString: function(){
			return channelToHex(this.r) + channelToHex(this.g) + channelToHex(this.b);
		},

		toString: function(){
			return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
		}
	};


	function channelToHex(c){
		var hex = c.toString(16);
		return (hex.length < 2 ? "0" + hex : hex);
	}

	return RGB;
});