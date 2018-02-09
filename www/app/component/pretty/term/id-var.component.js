module.exports = {
	template: `
		<span class="id-var clickable"
			ng-class="{highlighted:$ctrl.highlighted}"
			ng-mouseover="$ctrl.hover()"
			ng-mouseout="$ctrl.unhover()"
			ng-bind="$ctrl.name" />`,
	bindings: {
		name: '<',
		type: '@',
	},
	controller: function($scope)
	{
		var $ctrl = this;
		
		var defContext;
		searchDef($scope);
		function searchDef(scope)
		{
			if(scope.$parent && scope.$parent.$ctrl)
			{
				var context = scope.$parent;
				if(scope.$ctrl && scope.$ctrl.context)
				{
					context = scope.$ctrl.context;
				}
				
				var node = context.$ctrl.node;
				var flag;
				if(node)
				{
					if(node[0] === 'Let')
					{
						flag = checkDef(node[1]);
					}
					else if(node[0] === 'Split')
					{
						flag = checkDef(node[2]) || checkDef(node[3]);
					}
					else if(node[0] === 'Lam')
					{
						flag = checkDef(node[1]);
					}
					else if(node[0] === 'Case')
					{
						flag = checkDef(node[2]) || checkDef(node[4]);
					}
					else if(node[0] === 'Unroll')
					{
						flag = checkDef(node[2]);
					}
				}
				return flag ? context.$ctrl : searchDef(context);
			}
			function checkDef(name)
			{
				if($ctrl.name === name)
				{
					defContext = context;
					return true;
				}
			}
		}
		
		if(defContext)
		{
			var key = 'refs:' + $ctrl.name;
			var refs = defContext.$ctrl[key] || (defContext.$ctrl[key] = []);
			refs.push(this);
			
			$ctrl.highlighted = false;
			
			$ctrl.hover = function()
			{
				for(var ref of refs)
				{
					ref.highlighted = ref.name == $ctrl.name;
				}
			}
			
			$ctrl.unhover = function()
			{
				for(var ref of refs)
				{
					ref.highlighted = false;
				}
			}
		}
	}
};