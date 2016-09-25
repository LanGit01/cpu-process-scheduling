(function(){

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
		}

		Function.prototype.subclass.emptyClass = function(){};
	}


})();