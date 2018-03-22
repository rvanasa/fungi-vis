module.exports = {
	template: require('./landing-app.html'),
	controller: function(ExampleService)
	{
		var $ctrl = this;
		
		$ctrl.examples = ExampleService.examples;
		
		$ctrl.viewExample = function(example)
		{
			window.location.href = '/hfi?x=' + encodeURIComponent(example.id);
		}
	}
};