module.exports = function(App, Config)
{
	return App.listen(process.env.PORT || 80);
}