module.exports = function(Provided, Static, ES6Class, Config)
{
	return '`' + Provided + ':' + Static + '` : ' + Config.a + ' : ' + new ES6Class(1, 2, 3).getABC();
}