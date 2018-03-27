module.exports = {
	template: require('./landing-app.html'),
	controller: function(ExampleService)
	{
		var $ctrl = this;
		
		ExampleService.getIDs()
			.then(ids => $ctrl.examples = ids);
		
		$ctrl.viewExample = function(example)
		{
			window.location.href = '/hfi?x=' + encodeURIComponent(example.id);
		}
	}
};