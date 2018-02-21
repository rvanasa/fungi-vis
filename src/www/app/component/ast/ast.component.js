module.exports = {
	template: require('./ast.html'),
	bindings: {
		node: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.indent = $ctrl.indent || 0;
		
		$ctrl.isNode = function(item)
		{
			return Array.isArray(item);
		}
		
		$ctrl.toJSON = JSON.stringify;
	}
};