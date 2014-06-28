var lib = require('./lib');

var date = new Date().getTime();

var files = lib.dir('/Users/iLinco/Downloads', [], /\.zip/)

var now = new Date().getTime();

// console.log(now - date)
console.log(files.file.length)
// console.log(files.folder.length)




