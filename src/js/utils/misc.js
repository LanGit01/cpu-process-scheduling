(function(global){

	
	function selectionSort(array, comparator){
		var min, swapIndex, temp, i, j
			len = array.length;

		for(i = 0; i < len - 1; i++){
			min = array[i];
			swapIndex = i;


			for(j = i + 1; j < len; j++){
				if(comparator(min, array[j]) > 0){
					min = array[j];
					swapIndex = j;
				}
			}

			if(swapIndex !== i){
				temp = array[i];
				array[i] = array[swapIndex];
				array[swapIndex] = temp;
			}
		}

		return array;
	}


	global.selectionSort = selectionSort;


})(this);