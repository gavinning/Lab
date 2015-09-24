var fs = require('fs');
var path = require('path');
var Class = require('aimee-class');
var Lib = module.exports = Class.create();
var lib = new Lib,
    class2type = {},
    emArray = [],
    FN = function(){},
    core_toString = class2type.toString,
    core_hasOwn = class2type.hasOwnProperty,
    core_indexOf = emArray.indexOf;

// From jQuery 1.9.1
Lib.fn.extend({
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
})

// From jQuery 1.9.1
// Populate the class2type map
Lib.fn.each( "Boolean Number String Function Array Date RegExp Object Error".split(" "), function( i, name ) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// For client
Lib.fn.extend({

    isFile: function(src){
        try{
            return fs.statSync(src).isFile();
        }catch(e){
            return false;
        }
        return false;
    },

    isDir: function(src){
        try{
            return fs.statSync(src).isDirectory();
        }catch(e){
            return false;
        }
        return false;
    },

    isFolder: function(src){
        return this.isDir(src);
    },

    isDirectory: function(src){
        return this.isDir(src);
    },

    isAbsolute: function(src){
        return /^\/|^\w:/.test(src)
    },

    mkdir: function(src, child){
        var parent;

        if(!this.isDir(src)){
            try{
                fs.mkdirSync(src);
            }catch(e){
                parent = path.join(src, '../');
                this.mkdir(parent, src);
            }
            finally{
                child ? this.mkdir(child) : "";
            }
        }
    },

    toTemplate: function(str, space){
        space = space || '';
        str = '\n' + str.replace(/[\r\n]$/, '');
        str = str.replace(/[\r\n]/g, '\' +\n ' + space + ' \'') + '\';';
        str = str.replace(/^\' /, '');
        str = str.replace(/^\+[\r\n]/, '');
        str = '\'\'+\n' + str;
        return str;
    },

    formatHTML: function(str, space){
        return this.toTemplate(str, space);
    },

    // 遍历文件夹
    // 稳定版本
    dir: function(url, opt){
        var lib = this;
        var result = {};
        var files = result.files = [];
        var folders = result.folders = [];
        var defaults = {
            // 是否进行递归
            deep 			: true,

            // 过滤规则将以正则表达式方式进行判断，其中*被转换成通配符
            // 将优先执行过滤规则
            filterFile		: ['^.*', '.svn-base', '_tmp', '副本', 'desktop.ini', '.DS_Store'],
            filterFolder	: ['^.git$', '^.svn$'],


            // 将在过滤规则之后执行指定规则
            // 指定规则将以正则表达式方式进行判断，其中*被转换成通配符，同过滤规则
            onlyFile		: [],
            // 慎用，过滤的文件夹将不会进行递归检查
            onlyFolder		: []
        }

        // 不符合规则的url，直接返回
        if(!url || !lib.isDir(url)) return result;

        // 合并参数
        opt = lib.extend(defaults, opt);

        // 条件检查
        function verify(arr, obj){
            return arr.some(function(_filter){
                // 检查元素是否为字符串
                if(typeof _filter == 'string'){

                    // 转换通配符
                    _filter = _filter.replace('*.', '[\\s\\S]+\\.');
                    _filter = _filter.replace('.*', '\\.[\\s\\S]+');

                    // 执行条件检查
                    try{
                        return obj.match(new RegExp(_filter));
                    }catch(e){
                        throw e;
                    }
                }
                // 检查元素是否为regexp对象
                if(lib.type(_filter) == 'regexp'){

                    // 执行条件检查
                    try{
                        return obj.match(_filter);
                    }catch(e){
                        throw e;
                    }
                }
            })
        }

        // 递归
        function deepDir(_url){
            var arr = fs.readdirSync(_url);

            // 遍历当前文件夹子级
            arr.forEach(function(sub){
                var tmpSrc = path.join(_url, sub);
                var isFilterFile;
                var isFilterFolder;
                var isOnlyFile;
                var isOnlyFolder;

                // 处理文件
                if(lib.isFile(tmpSrc)){
                    // 判断是否为应该过滤的文件
                    isFilterFile = verify(opt.filterFile, sub);
                    // 不被过滤的文件进行下一步处理
                    if(!isFilterFile){

                        // 判断是否已指定需要的文件
                        // 当存在指定文件时，过滤不需要的文件，将指定文件放进files数组
                        if(opt.onlyFile.length > 0){
                            // 判断是否为指定的文件
                            isOnlyFile = verify(opt.onlyFile, sub);
                            // 指定的文件放入数组
                            if(isOnlyFile){
                                files.push(tmpSrc);
                            }

                        // 当不存在指定文件时，直接将文件放进数组
                        }else{
                            files.push(tmpSrc);
                        }
                    }
                }

                // 处理文件夹
                if(lib.isDir(tmpSrc)){
                    // 判断是否为应该过滤的文件夹
                    isFilterFolder = verify(opt.filterFolder, sub);
                    // 不被过滤的文件夹进行下一步处理
                    if(!isFilterFolder){

                        // 判断是否已指定需要的文件夹
                        // 当存在指定文件夹时，过滤不需要的文件夹，将指定文件夹放进folders数组
                        if(opt.onlyFolder.length > 0){
                            // 判断是否为指定的文件夹
                            isOnlyFolder = verify(opt.onlyFolder, sub);
                            // 指定的文件夹放入数组
                            if(isOnlyFolder){
                                folders.push(tmpSrc);

                                // 判断是否执行递归
                                if(opt.deep){
                                    deepDir(tmpSrc);
                                }
                            }

                        // 当不存在指定文件夹时，直接将文件夹放进数组
                        }else{
                            folders.push(tmpSrc);

                            // 判断是否执行递归
                            if(opt.deep){
                                deepDir(tmpSrc);
                            }
                        }
                    }
                }
            })
        };

        // 递归
        deepDir(url);

        return result;
    },

    // 数据流复制
    stream: function(source, target, callback){
        var input = fs.createReadStream(source);
        var output = fs.createWriteStream(target);

        input.pipe(output);

        input.on('end', function(){
            output.end();
            callback(null, source, target);
        });
    },

    upload: function(url, file, callback){
        var http = require('http');
        var opt, req, input;

        opt = require('url').parse(url);
        opt.method = 'POST';

        req = http.request(opt, function(res){
            if(res.statusCode == 201){
                callback(null, res);
            }else{
                console.log('upload failed.');
            }
        });

        input = fs.createReadStream(file);
        input.pipe(req);
    },

    // 获取目标路径
    getTarget: function(file, source, target){
        return path.join(target, path.relative(source, file))
    },

    // 复制文件|文件夹
    copy: function(source, target, callback){
        require('copy-dir')(source, target, callback || FN);
    },

    // 删除文件|文件夹
    delete: function(source, callback){
        require('rm-rf')(source, callback || FN);
    },

    // 移动文件|文件夹
    move: function(source, target, callback){
        this.copy(source, target, function(e){
            if(e){
                if(callback){
                    callback(e)
                }else{
                    throw e;
                }
                return;
            }
            this.delete(source, callback || FN);
        }.bind(this))
    },

    cp: function(){
        this.cp.apply(this, arguments);
    },

    rm: function(){
        this.delete.apply(this, arguments);
    },

    mv: function(){
        this.move.apply(this, arguments);
    }

})
