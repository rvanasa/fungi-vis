var parser = require('./src/www/app/service/parser');

module.exports = function(source)
{
	this.cacheable();
	
	var bundle = parser(source)[1];
	
	return `module.exports = ${JSON.stringify(bundle)}`;
}