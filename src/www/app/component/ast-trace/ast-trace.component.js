module.exports = {
	template: require('./ast-trace.html'),
	bindings: {
		node: '<',
		depth: '<',
	},
	controller: function()
	{
		var $ctrl = this;
		
		$ctrl.isNode = function(item)
		{
			return Array.isArray(item);
		}
		
		$ctrl.toJSON = JSON.stringify;
	}
};