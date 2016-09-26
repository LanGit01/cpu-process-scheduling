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
	function LinkedList(compareFunc, keyFunc){
		this._head = null;
		this._tail = null;

		this._length = 0;

		this._compareFunc = (typeof compareFunc === "function" ? compareFunc : null);
		
		if(typeof keyFunc === "function"){
			this._keyFunc = keyFunc;
		}else{
			this._keyFunc = function(v){
				return v;
			}
		}
		
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

		this._length++;
	}

	/*
	 *	Removes the first node that contains the value of the `value` argument
	 *
	 *	If a keyFunc is provided in the construction of the list, the node data is 
	 *	passed to `keyFunc`, and the return value is used for comparison 
	 */
	LinkedList.prototype.remove = function(value){
		var element = prev = null,
			current,
			keyFunc = this._keyFunc;

			for(current = this._head; current !== null; current = current.next){
				if(value === keyFunc(current.data)){
					element = current.data;
					break;
				}
				prev = current;
			}
		

		// No matching element found
		if(current === null){
			return null;
		}

		// matching element found, remove and make adjustments
		if(prev === null){
			// element matched at head
			this._head = this._head.next;

			if(this._head === null){
				this._tail = null;
			}
		}else{
			prev.next = current.next;

			// if the tail was deleted
			if(current.next === null){
				this._tail = prev;
			}
		}

		this._length--;

		return element;
	}

	/**
	 *	return - element at `index` or
	 *			 null if index is out of bounds
	 */
	LinkedList.prototype.elementAt = function(index){
		var current = this._head, i;

		if(index < 0 || index > this._length - 1){
			return null;
		}

		for(i = 0; i < index; i++){
			current = current.next;
		}

		return current.data;
	}


	LinkedList.prototype.getLength = function(){
		return this._length;
	}


	global.CPUscheduling.LinkedList = LinkedList;

})(window);