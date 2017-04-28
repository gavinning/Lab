var tape = require('tape');
var lib = require('../')

tape('test is', function (t) {
    [
        lib.isDir(__dirname),
        lib.isFolder(__dirname),
        lib.isDirectory(__dirname),
        lib.isFile(__filename),
        lib.isAbsolute('/'),
        lib.isAbsolute('/usr/local/bin'),
        lib.isAbsolute('c:\\'),
        !lib.isAbsolute('../')

    ].forEach(function(item){
        t.ok(item, 'should be ok');
    })

    t.end()
});
