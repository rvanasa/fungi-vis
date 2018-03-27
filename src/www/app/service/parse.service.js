var parser = require('./parser');

module.exports = function ParseService()
{
	this.parse = function(input)
	{
		return JSON.parse(input);
		// return parser(input);
	}
}