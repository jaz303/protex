var test = require('tape');
var protex = require('..');
global.Promise = require('es6-promise').Promise;

test("locking with promises", function(assert) {

	assert.plan(4);

	function makeLockCheck(shouldBeLocked) {
		return function() {
			assert.equal(p.isLocked(), shouldBeLocked);
			return new Promise(function(resolve, reject) {
				process.nextTick(resolve);
			});
		}
	}

	var p = protex();

	var result = p.exec(
		Promise
			.resolve()
			.then(makeLockCheck(true))
			.then(makeLockCheck(true))
			.then(makeLockCheck(true))
	)

	result.then(makeLockCheck(false));

});

test("locking with functions", function(assert) {

	var p = protex();

	var result = p.exec(function() {
		assert.equal(p.isLocked(), true, "should be locked whilst function is executing");
		return 10;
	});

	assert.equal(p.isLocked(), false, "should not be locked after function call");
	assert.equal(result, 10, "return value should be return value of function");
	assert.end();

});

test("function returning promise", function(assert) {

	assert.plan(4);

	var p = protex();

	var result = p.exec(function() {
		assert.ok(p.isLocked(), "should be locked in body of function");
		return new Promise(function(resolve, reject) {
			assert.ok(p.isLocked(), "should be locked in body of promise");
			process.nextTick(resolve);
		});
	});

	assert.ok(p.isLocked(), "should be locked after function returns");

	result.then(function() {
		assert.ok(!p.isLocked(), "should be unlocked once promise is complete");
	});

});