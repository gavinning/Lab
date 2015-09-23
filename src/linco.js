/*
 * Linco.js v0.0.1
 * Base library for lib
 * Author, gavinning
 * Home, www.ilinco.com
 */

(function(){
var Linco,
	class2type = {},
	emArray = [],
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_indexOf = emArray.indexOf;

Linco = function(parent) {
	var linco = function() {
		this.init.apply(this, arguments);
	};

	if (parent) {
		var child = function(){};
		child.prototype = parent.prototype;
		linco.prototype = new child;
	};

	// linco init
	linco.prototype.init = function() {};

	// Define alias
	linco.fn = linco.prototype;

	// Define proxy
	linco.proxy = function(fn) {
		var _this = this;
		return (function() {
			return fn.apply(_this, arguments);
		});
	};

	// Define prototype parent
	linco.fn.parent = linco;
	linco.fn.class = linco;
	linco.fn.Class = linco;
	linco.fn.proxy = linco.proxy;
	linco._super = linco.__proto__;
	linco.extend = linco.fn.extend = Linco.extend;
	linco.include = function(obj){
		linco.fn.extend(obj);
	};
	linco.extend(Linco);
	linco.fn.extend(Linco);

	return linco;
};

// From jQuery 1.9.1
Linco.isArraylike = function isArraylike(obj) {
	var length = obj.length,
		type = this.type(obj);

	if (this.isWindow(obj)) {
		return false;
	}

	if (obj.nodeType === 1 && length) {
		return true;
	}

	return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj);
};

// Define extend
Linco.extend  = function() {
	var src, copyIsArray, copy, name, options, clone,
	target = arguments[0] || {},
	i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== "object" && !Linco.isFunction(target)) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if (length === i) {
		target = this;
		--i;
	}

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (Linco.isPlainObject(copy) || (copyIsArray = Linco.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Linco.isArray(src) ? src : [];

					} else {
						clone = src && Linco.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = Linco.extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

// From jQuery 1.9.1
Linco.extend({

	// args is for internal usage only
	each: function(obj, callback, args) {
		var value,
		i = 0,
			length = obj.length,
			isArray = this.isArraylike(obj);

		if (args) {
			if (isArray) {
				for (; i < length; i++) {
					value = callback.apply(obj[i], args);

					if (value === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					value = callback.apply(obj[i], args);

					if (value === false) {
						break;
					}
				}
			}

			// A special, fast, case for the most common use of each
		} else {
			if (isArray) {
				for (; i < length; i++) {
					value = callback.call(obj[i], i, obj[i]);

					if (value === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					value = callback.call(obj[i], i, obj[i]);

					if (value === false) {
						break;
					}
				}
			}
		}

		return obj;
	},

	type: function( obj ) {
		if ( obj == null) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ? class2type[core_toString.call( obj )] || "object" : typeof obj;
	},

	isFunction: function( obj ) {
		return this.type( obj ) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return this.type( obj ) === "array";
	},

	isNumber: function( obj ) {
		return this.type( obj ) === "number";
	},

	isString: function( obj ) {
		return this.type( obj ) === "string";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || this.type( obj ) !== "object" || obj.nodeType || this.isWindow( obj ) ) {
			return false;
		};

		try {
			// Not own constructor property must be Object
			if ( obj.constructor && !core_hasOwn.call( obj, "constructor" ) && !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		};

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			};

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[i] === elem ) {
					return i;
				}
			}
		};

		return -1;
	},

	now: function(){
		return (new Date((new Date()).getTime() + 8 * 60 * 60 * 1000)).toJSON().replace('Z', '').split('T').join(' ').slice(0, 19);
	}

});

// From jQuery 1.9.1
// Populate the class2type map
Linco.each( "Boolean Number String Function Array Date RegExp Object Error".split(" "), function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

try{
	window.Linco = new Linco;
}catch(e){
	// console.log('window is not defined.');
};
try{
	module.exports = new Linco;
}catch(e){
	// console.log('module is not defined.');
};
try{
	define('linco',[],function () {return new Linco});
}catch(e){
	// console.log('define is not defined.');
};
})();