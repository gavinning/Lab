var tape = require('tape');
var lib = require('../')

tape('test core', function (t) {
    t.equal(lib.type(1), 'number');
    t.equal(lib.type('1'), 'string');
    t.equal(lib.type([]), 'array');
    t.equal(lib.type({}), 'object');

    [
        lib.isNumber(1),
        lib.isArray([]),
        lib.isString('1'),
        lib.isFunction(lib.type),
        lib.isPlainObject({})
    ].forEach(function(item){
        t.ok(item, 'should be ok');
    })

    t.end()
});

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
