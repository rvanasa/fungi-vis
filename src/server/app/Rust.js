var express = require('express');

module.exports = function(App)
{
	App.use(express.static(this.config.basePath + '/rust/target/wasm32-unknown-emscripten/debug'));
}
