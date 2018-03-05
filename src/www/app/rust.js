var wasm = require('../../rust/src/main.rs');

var promise = wasm();
window.RustPromise = promise;

promise.then(result =>
{
	// console.log(module)///
	
	console.log(result)///
	
	console.log(result.instance.exports.test(123));
});
