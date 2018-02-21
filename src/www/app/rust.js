var wasm = require('../../rust/src/main.rs');

var promise = wasm.initialize({noExitRuntime: true});
window.RustPromise = promise;

promise.then(module =>
{
	// var test = module.cwrap('test', 'string', ['string']);
	//
	// console.log(test('123'));
});
