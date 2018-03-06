var wasm = require('../../rust/src/main.rs');

window.RustPromise = wasm();
