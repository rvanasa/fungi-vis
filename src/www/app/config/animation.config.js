module.exports = function($animateProvider)
{
	// only `.allow-anim` elements will be animated by Angular
	$animateProvider.classNameFilter(/allow-anim/);
}