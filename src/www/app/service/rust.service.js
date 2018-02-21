var wasm = require('../../../rust/src/main.rs');

module.exports = function RustService()
{
	wasm.initialize({noExitRuntime: true})
		.then(module =>
		{
			var test = module.cwrap('test', 'number', ['string']);
			
			
		});
}