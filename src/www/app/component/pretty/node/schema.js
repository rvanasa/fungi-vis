module.exports = function(type)
{
	return {
		template: `
			<p-handle type="${type}"
				ng-class="{selected:$ctrl.cursor.type==$ctrl.node._type, error:$ctrl.node._type.vis[1].local_err}"
				ng-mouseover="$ctrl.focus(); $event.stopPropagation()"
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
					
					if(path.length > 6)
					{
						path = path.slice(-6);
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