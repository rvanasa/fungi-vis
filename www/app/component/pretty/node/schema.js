module.exports = function(type)
{
	return {
		template: `
			<p-handle type="${type}"
				ng-mouseenter="$ctrl.focus(); $event.stopPropagation()"
				ng-mouseout="$ctrl.unfocus(); $event.stopPropagation()"
				ng-mousedown="$ctrl.select() && $event.stopPropagation()"
			/>`,
		bindings: {
			node: '<',
			context: '<',
		},
		controller: function(Cursor)
		{
			var $ctrl = this;
			
			$ctrl.isNode = function(item)
			{
				return Array.isArray(item);
			}
			
			$ctrl.toJSON = JSON.stringify;
			
			$ctrl.cursor = Cursor;
			
			$ctrl.focus = function()
			{
				if(!Cursor.path)
				{
					var path = [];
					var node = $ctrl.node;
					while(node)
					{
						path.unshift(node);
						node = node._parent;
					}
					
					if(path.length > 8)
					{
						path = path.slice(-8);
						path.unshift(['...']);
					}
					Cursor.path = path;
				}
				
				// if($ctrl.node._type)
				// {
				// 	Cursor.type = $ctrl.node._type;
				// 	return true;
				// }
			}
			
			$ctrl.unfocus = function()
			{
				if(Cursor.path && Cursor.path[Cursor.path.length - 1] === $ctrl.node)
				{
					Cursor.path = null;
				}
				// if(Cursor.type === $ctrl.node._type)
				// {
				// 	Cursor.type = null;
				// }
			}
			
			$ctrl.select = function()
			{
				if($ctrl.node._type)
				{
					Cursor.type = $ctrl.node._type;
					return true;
				}
			}
		}
	};
}