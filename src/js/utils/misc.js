define(function(){

	/**
	 *	Sorts the array in ascending order using the selection sort algorithm
	 *
	 *	@param {function} compareFunc - a function that compares two elements, returning:
	 *							 	  - a positive number if the first element is greater,
	 *								  - a negative number if the second element is greater,
	 *								  - zero if they are equal
	 */
	function selectionSort(array, compareFunc){
		var min, swapIndex, temp, i, j
			len = array.length;

		for(i = 0; i < len - 1; i++){
			min = array[i];
			swapIndex = i;


			for(j = i + 1; j < len; j++){
				if(compareFunc(min, array[j]) > 0){
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

	window.selectionSort = selectionSort;
	

	if(typeof Function.prototype.subclass === "undefined"){

		/**
		 *	Syntactical sugar for assigning a prototype object to another object (subclassing)
		 *
		 *	Works by linking the subclass's prototype to the parent class's prototype only, and not
		 *	on an instance of the parent class. This is done because intatiating a "parent class"
		 *	object will invoke its constructor, and since we're not passing parameters, it could
		 *	cause problems. 
		 *
		 */
		Function.prototype.subclass = function(parentClass){
			var newProto = Function.prototype.subclass.emptyClass;
			newProto.prototype = parentClass.prototype;
			this.prototype = new newProto();
		};

		Function.prototype.subclass.emptyClass = function(){};
	}
});