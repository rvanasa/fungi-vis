var angular = window.angular;

module.exports = function()
{
	window.$node = function(elem)
	{
		var scope = angular.element(elem).scope();
		while(scope)
		{
			if(scope.$ctrl && scope.$ctrl.node)
			{
				return scope.$ctrl.node;
			}
			scope = scope.$parent;
		}
	}
}