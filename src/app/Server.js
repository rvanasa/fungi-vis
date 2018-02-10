module.exports = function(App, Config)
{
	return App.listen(process.env.PORT || Config.port || 80);
}