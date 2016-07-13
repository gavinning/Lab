# Lab
![ilinco icon](http://ilinco.com/images/logo.png)

**Linco.lab**, 用于支持日常开发nodejs模块.

## Install
```sh
npm install linco.lab --save
```
```js
var lab = require('linco.lab');
```

```js
lab.isDir(__dirname)        // => true

lab.isFile(__filename)      // => true

lab.isSymlink(__dirname)   // => false
```

```js
lab.now()                   // => 2015-12-12 16:12:10

lab.mkdir('/a/b/c/d')       // => /a/b/c/d
```

```js
lab.isNumber(1)             // => true

lab.isArray([])             // => true

lab.isPlainObject({})       // => true

lab.isEmptyObject({})       // => true

lab.isString('1')           // => true

lab.type(1) === 'number'    // => true

lab.type([]) === 'array'    // => true

lab.type({}) === 'object'   // => true

lab.type('1') === 'string'  // => true

lab.type(lab.type) === 'function'   // => true

```
