module.exports = {
	template: require('./ast.html'),
	bindings: {
		node: '<',
		depth: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.depth = $ctrl.depth || 0;
		
		$ctrl.isNode = function(item)
		{
			return Array.isArray(item);
		}
		
		$ctrl.toJSON = JSON.stringify;
	}
};