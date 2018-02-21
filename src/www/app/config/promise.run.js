module.exports = function($q)
{
	// help Angular automatically update UI after promise resolution in dependencies
	window.Promise = $q;
}