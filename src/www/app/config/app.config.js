module.exports = function($locationProvider, $compileProvider)
{
	$locationProvider.html5Mode(true);
	
	$compileProvider.preAssignBindingsEnabled(true);
}