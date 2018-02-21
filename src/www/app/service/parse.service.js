var parser = require('./parser');

module.exports = function ParseService()
{
	this.parse = function(input)
	{
		var result = parser.parse(input);
		if(!result.status)
		{
			var nearby = input.substr(result.index.offset, 1);
			throw new Error(`Unexpected ${nearby.length ? 'symbol ' + nearby : 'end of script'} (line ${result.index.line}, col ${result.index.column})`);
		}
		return result.value;
	}
}