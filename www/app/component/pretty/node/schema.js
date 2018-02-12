module.exports = function(type)
{
	return {
		template: `
			<p-handle type="${type}"
				ng-mouseover="$ctrl.select() && $event.stopPropagation()"
				ng-mouseout="$ctrl.deselect() && $event.stopPropagation()" />`,
		bindings: {
			node: '<',
			context: '<',
		},
		controller: function($scope, Cursor)
		{
			var $ctrl = this;
			
			$ctrl.isNode = function(item)
			{
				return Array.isArray(item);
			}
			
			$ctrl.toJSON = JSON.stringify;
			
			$ctrl.cursor = Cursor;
			
			$ctrl.select = function()
			{
				var path = [$ctrl.node];
				var parent = $scope.$parent;
				while(parent)
				{
					if(parent.$ctrl)
					{
						var node = parent.$ctrl.node;
						if(node && !path.includes(node))
						{
							path.unshift(node);
							if(node._label)
							{
								path.unshift(['DebugLabel']);
							}
							if(node._type)
							{
								path.unshift(['TypeInfo']);
							}
						}
					}
					parent = parent.$parent;
				}
				
				if(path.length > 5)
				{
					path = path.slice(-5);
					path.unshift(['...']);
				}
				Cursor.path = path;
				
				if($ctrl.node && $ctrl.node._type)
				{
					Cursor.type = $ctrl.node._type;
					return true;
				}
			}
			
			$ctrl.deselect = function()
			{
				// Cursor.type = null;
				// return true;
			}
		}
	};
}