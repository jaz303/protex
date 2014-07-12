# protex

`protex` is like a mutex but for Promises. That is, an instance executes one promise at a time and remains locked until the `Promise` is resolved.

## Example:

```javascript
var protex = require('protex')();

protex.isLocked(); // => false

// Submit a promise chain for execution.
// The protex instance will remain locked until the returned promise is fulfilled.
var promise = protex.exec(function() {
	return Promise.resolve()
		.then(task1)
		.then(function() {
			try {
				protex.exec(function() {
					console.log("i won't run");
				});
			} catch (e) {
				protex.isLocked(); // => true
			}
		})
		.then(task2)
});

promise.then(function() {
	console.log("protex is now unlocked!");
});
```

## Installation

### npm

Get it:

	npm install protex

Require it:

	var protex = require('protex');

### UMD etc.

Copy and paste `build/protex.js` or `build/protex.min.js` to your project.

## API

#### `var prx = protex()`

Create a new `protex`.

#### `prx.isLocked()`

Returns `true` if currently locked, `false` otherwise.

#### `prx.exec(thing)`

Submit `thing` for execution. Throws an exception if currently locked.

`thing` can be either a `function` or a `Promise`, although functions are preferred - the reason being that Promises begin to execute the moment they are created, i.e. __before prx.exec() is called__, meaning that it's possible to circumvent the lock. Passing a function will correctly delay the instantation of the `Promise` until `prx.exec()` has been called and locking is complete.

If `thing` is a function and it doesn't return a `Promise` it is assumed that the function is synchronous and the `protex` is unlocked immediately after the call returns.

## Copyright &amp; License

&copy; 2014 Jason Frame [ [@jaz303](http://twitter.com/jaz303) / [jason@onehackoranother.com](mailto:jason@onehackoranother.com) ]

Released under the ISC license.