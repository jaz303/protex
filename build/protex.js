!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.protex=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = protex;

function protex() {

	var locked = false;

	function isPromise(thing) {
		return thing instanceof Promise;
	}

	function isLocked() {
		return locked;
	}

	function execPromise(promise) {
		locked = true;
		return promise.then(function() {
			locked = false;
		});
	}

	function execFunction(fn) {
		locked = true;
		var result = fn();
		if (isPromise(result)) {
			return execPromise(result);
		} else {
			locked = false;
			return result;
		};
	}

	function exec(thing) {

		if (locked) {
			throw new Error("protex is already locked!");
		}

		locked = true;

		if (typeof thing === 'function') {
			return execFunction(thing);
		} else if (thing instanceof Promise) {
			return execPromise(thing);
		} else {
			throw new Error("exec() expects either a function or a promise");
		}

	}

	return {
		isLocked	: function() { return locked; },
		exec 		: exec
	};

}
},{}]},{},[1])
(1)
});