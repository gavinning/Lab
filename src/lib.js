var fs = require('fs');
var path = require('path');
var Class = require('aimee-class');
var Lib = Class.create();
var lib = new Lib;

Lib.include(require('./is'));
Lib.include(require('./core'));

Lib.include({

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
    }
})

lib.Lib = Lib;
module.exports = new Lib;
