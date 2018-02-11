module.exports = function() {
	return {
		transclude: true,
		controller: function($scope, $transclude, $attrs, $element)
		{
			var childScope;
			$scope.$watch($attrs.target, value =>
			{
				$element.empty();
				if(childScope)
				{
					childScope.$destroy();
					childScope = null;
				}
				
				$transclude((clone, newScope) =>
				{
					childScope = newScope;
					$element.append(clone);
				});
			});
		}
	};
}