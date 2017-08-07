define(function(){
	/**
	 *	Callback for comparing two elements for ordering
	 *	
	 *	@callback compareFunc
	 *	@param {element} first element to compare
	 *	@param {element} second element to compare
	 *  @return {int} - positive number if the second element before first
	 *				  - negative number if the first element before first
	 *				  - zero if the elements are equal
	 */

	/**
	 *	Returns the key(identifier) for the element
	 *
	 *	@callback keyFunc
	 *	@param {element} element to identify
	 *	@return key
	 */

	/**
	 *	An implementaion of a singly linked list.
	 *
	 *	Orders the elements in ascending order. A compare function can be provided to define the
	 *	ordering. A key getter function can be provided for identification of the elements.
	 * 
	 *	@param {compareFunc} compareFunc
	 *	@param {keyFunc} keyFunc
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
	 *	If a compare function is not provided, will insert elements at the end of the list.
	 *	If a compare function is provided, it will determine the order of the elements
	 *	If the element to be inserted is not unique with respect to compareFunc, 
	 *	the element will be placed after the similar elements
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

				while(current.next !== null && compareFunc(newNode.data, current.next.data) >= 0){
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
	};


	/*
	 *	Removes the matching element from the list.
	 *
	 *	Uses the keyFunc for identification. If no keyFunc function provided, uses strict
	 *	equality operator to compare `value` to elements.
	 *
	 *	@return {?element} element removed from list
	 *					  null if value is not matched, and none is removed
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
	};


	/**
	 *	Removes the head of the list
	 *	
	 *	@return {?element} element removed
	 *					  null if list is empty
	 */
	LinkedList.prototype.removeHead = function(){
		var element;

		if(this._head === null){
			return null;
		}

		element = this._head.data;

		if(this._head === this._tail){
			this._head = this._tail = null;
		}else{
			this._head = this._head.next;
		}

		this._length--;
		return element;
	};


	/**
	 *	Not implemented
	 */
	LinkedList.prototype.removeTail = function(){

	};


	/**
	 *	@return {?element} element at index,
	 *					  null if index is out of bounds
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
	};


	LinkedList.prototype.getLength = function(){
		return this._length;
	};


	LinkedList.prototype.getIterator = function(){
		return new Iterator(this);
	};


	LinkedList.prototype.toArray = function(){
		var ar = [], 
			itr = this.getIterator();

		while(itr.hasNext()){
			ar[ar.length] = itr.getNext();
		}

		return ar;
	};






	/**
	 *	Used for iterating over elements in the linked list
	 *
	 *	Usage:
	 *		var list = new LinkedList();
	 *		// insert elements
	 *		
	 *		var iterator = list.getIterator(),
	 *			elements;
	 *		while(iterator.hasNext()){
	 *			element = iterator.getNext();
	 *		}
	 */
	function Iterator(list){
		this._current = list._head;
	}


	Iterator.prototype.hasNext = function(){
		return (this._current !== null);
	};


	/**
	 *	Returns the next element and increments the iterator
	 *	
	 *	@return {element} the next element
	 */
	Iterator.prototype.getNext = function(){
		if(!this.hasNext()){
			return null;
		}

		var element = this._current.data;
		this._current = this._current.next;
		return element;
	};


	/**
	 *	Returns the next element without incrementing the iterator
	 *
	 *	@return {element} the next element
	 */
	Iterator.prototype.peekNext = function(){
		if(!this.hasNext()){
			return null;
		}

		return this._current.data;
	};



	return LinkedList;
});