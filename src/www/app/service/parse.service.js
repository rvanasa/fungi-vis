var parser = require('./parser');

module.exports = function ParseService()
{
	this.parse = function(input)
	{
		return parser(input);
	}
}