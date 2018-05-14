module.exports = function ExampleService($http, ParseService)
{
	// this.examples = context.keys().map(id =>
	// {
	// 	id = id.replace(/^\.\//, '').replace(/.fgb$/, '');
		
	// 	return {
	// 		id,
	// 		name: id.replace(/^fungi_lang::examples::/, ''),
	// 		// bundle: ParseService.parse(context(id)),
	// 		// bundle: context(id),
	// 	};
	// });
	
	this.getIDs = function()
	{
		return $http.get(`/examples`)
			.then(response => response.data.map(id =>
			{
				id = id.replace(/\.fgb$/, '');
				return {
					id: id,
					name: id.replace(/^fungi_lang\.examples\./, ''),
				};
			}));
	}
	
	this.find = function(id)
	{
		return $http.get(`/examples/${id}.fgb`)
			.then(response => response.data)
			.then(ParseService.parse);///////
	}
}