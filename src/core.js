var class2type = {},
    emArray = [],
    FN = function(){},
    core_toString = class2type.toString,
    core_hasOwn = class2type.hasOwnProperty,
    core_indexOf = emArray.indexOf;

// From jQuery 1.9.1
module.exports = {
    isArraylike: function(obj) {
        var length = obj.length,
            type = this.type(obj);

        if (this.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj);
    },

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
        return (new Date((new Date()).getTime() + 864e+5)).toJSON().replace('Z', '').split('T').join(' ').slice(0, 19);
    }
}


// From jQuery 1.9.1
// Populate the class2type map
module.exports.each( "Boolean Number String Function Array Date RegExp Object Error".split(" "), function( i, name ) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});
