(function(global){

	// namespace check
	if(typeof global.CPUscheduling !== "object" || global.CPUscheduling === null){
		console.log("CPUscheduling is not defined. Module unable to load.");
		return;
	}


	/**
	 *	An implementaion of a singly linked list.
	 *
	 *	If a compare function is provided, inserted elements are sorted in ascending order
	 * 
	 *	compareFunc - function - a function that compares two elements, returning:
	 *							 	- a positive number if the first element is greater,
	 *								- a negative number if the second element is greater,
	 *								- zero if they are equal
	 */
	function LinkedList(compareFunc){
		this._head = null;
		this._tail = null;

		// function for comparing elements
		this._compareFunc = (typeof compareFunc === "function" ? compareFunc : null);	
	}

	/*
	 *	If a compare function is not provided, will insert elements at the end of the list
	 *	
	 */
	LinkedList.prototype.insert = function(element){

		var compareFunc = this._compareFunc,
			current, newNode;
		
		newNode = {
			data: element,
			next: null
		};

		if(this._head === null){
			this._head = newNode;
			this._tail = this._head;
		}else
		if(compareFunc){
			if(compareFunc(this._head.data, newNode.data) > 0){
				newNode.next = this._head;
				this._head = newNode;
			}else{
				current = this._head;

				while(current.next !== null && compareFunc(newNode.data, current.next.data) > 0){
					current = current.next;
				}

				newNode.next = current.next;
				current.next = newNode;

				if(newNode.next === null){
					this._tail = newNode.next;
				}
			}
		}else{
			this._tail.next = newNode;
			this._tail = newNode;
		}
	}


	LinkedList.prototype.remove = function(){

	}


	global.CPUscheduling.LinkedList = LinkedList;

})(window);