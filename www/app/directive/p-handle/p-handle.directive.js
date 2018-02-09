var angular = window.angular;

var templates = require.context('./template', true, /\.html$/i);
var templateKeys = new Set(templates.keys());

var fallbackTemplate = require('./fallback.html');

module.exports = function($parse, $compile)
{
	return {
		restrict: 'E',
		// scope: true,
		link(scope, elem, attrs)
		{
			var $ctrl = scope.$ctrl;
			
			// var $ctrl = scope.$ctrl = {
			// 	node: $parse(attrs['node'])(scope),
			// };
			
			// $ctrl.isNode = function(item)
			// {
			// 	return Array.isArray(item);
			// }
			
			// $ctrl.toJSON = JSON.stringify;
			
			var type = attrs['type'] || 'exp';
			
			// var id = $ctrl.isNode($ctrl.node) && $ctrl.node[0];
			var id = $ctrl.isNode($ctrl.node) && $ctrl.node[0];
			id = id && `./${type}/${id}.html`;
			
			var elems = $compile(templateKeys.has(id) ? templates(id) : fallbackTemplate)(scope);
			angular.element(elem).append(elems).html();
		}
	};
}