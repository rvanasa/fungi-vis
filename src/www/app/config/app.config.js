module.exports = function($locationProvider, $compileProvider)
{
	$locationProvider.html5Mode({
		enabled: true,
		rewriteLinks: false,
	});
	
	$compileProvider.preAssignBindingsEnabled(true);
}