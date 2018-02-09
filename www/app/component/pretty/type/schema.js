module.exports = function(type)
{
	return {
		template: `<p-handle type="${type}">`,
		bindings: {
			node: '<',
			context: '<', ///temp?
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
}