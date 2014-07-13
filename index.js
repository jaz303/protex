module.exports = protex;

function protex() {

    var locked = false;

    function isPromise(thing) {
        return thing instanceof Promise;
    }

    function execPromise(promise) {
        locked = true;

        function release() {
            locked = false;   
        }

        promise.then(release, release);

        return promise;
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

        if (typeof thing === 'function') {
            return execFunction(thing);
        } else if (thing instanceof Promise) {
            return execPromise(thing);
        } else {
            throw new Error("exec() expects either a function or a promise");
        }

    }

    return {
        isLocked    : function() { return locked; },
        exec        : exec
    };

}