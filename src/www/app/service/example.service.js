module.exports = function ExampleService(ParseService)
{
	var context = window.ExampleContext;
	
	this.examples = context.keys().map(id =>
	{
		id = id.replace(/^\.\//, '').replace(/.fgb$/, '');
		
		return {
			id,
			name: id.replace(/^fungi_lang::examples::/, ''),
			// bundle: ParseService.parse(context(id)),
			// bundle: context(id),
		};
	});
	
	this.find = function(id)
	{
		id = `./${id}.fgb`;
		return ParseService.parse(context(id))[1];
		return context(id);
	}
}