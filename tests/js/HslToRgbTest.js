require.config({
	baseUrl: "../src/js/gui"
});

require(["HueGenerator"], function(HG){
	var RED = 0,
		GREEN = 1,
		BLUE = 2;

	var marginOfError = 2, i, control, result, diff;

	var hslToRgbData = [
		[[0, 0, 0,], [0, 0, 0]],
		[[0.1, 0.1, 0.1], [28, 26, 23]],
		[[0.5, 0.5, 0.5], [64, 191, 191]],
		[[0.7, 0.7, 0.7], [146, 125, 232]],
		[[1, 1, 1], [255, 255, 255]],
		[[0.1, 0.3, 0.5], [166, 135, 89]],
		[[0.7, 0.2, 0.4], [90, 82, 122]],
		[[0.9, 0.6, 0.8], [235, 173, 210]]
	];


	result = hslToRgbData.map(function(dataVal){
		var hslData = dataVal[0],
			rgbData = dataVal[1];

		return HG.hslToRgb(hslData[RED], hslData[GREEN], hslData[BLUE]);
	});

	control = hslToRgbData.map(function(dataVal){
		return dataVal[1];
	});

	console.log(displayAccuracy(diffResults(control, result)));



	function diffResults(control, result){
		return result.map(function(resultVal, index){
			var controlVal = control[index]
			return [resultVal.r - controlVal[RED], resultVal.g - controlVal[GREEN], resultVal.b - controlVal[BLUE]];
		});
	}


	function displayAccuracy(diffResults){
		return diffResults.reduce(function(text, val, i){
			var rowText = "----  Row " + i + "  ----";

			rowText += "\nRed: " + accuracyToString(val[RED]);
			rowText += "\nGreen: " + accuracyToString(val[GREEN]);
			rowText += "\nBlue: " + accuracyToString(val[BLUE]);
			rowText += "\n\n";

			return text + rowText;
		}, "");


		function accuracyToString(val){
			if(val === 0){
				return "accurate";
			}else
			if(val >= -marginOfError && val <= marginOfError){
				return "within margin of error";
			}else{
				return "inaccurate";
			}
		}
	}

});