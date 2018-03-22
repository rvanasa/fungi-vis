var express = require('express');
var morgan = require('morgan');

module.exports = function(App, Config, Repo, log)
{
	if(Config.resourcePath)
	{
		App.use(express.static(Config.resourcePath));
	}
	else
	{
		var webpack = require('webpack');
		var devMiddleware = require('webpack-dev-middleware');
		
		Repo.then(() =>
		{
			var compiler = webpack(require(this.config.basePath + '/../webpack.config'));
			App.use(require('webpack-hot-middleware')(compiler, {log}));
			App.use(devMiddleware(compiler, {
				stats: {colors: true},
				inline: true,
				hot: true,
			}));
		});
	}
	
	// App.use('/api', API);
	App.use('/lib', express.static(this.config.basePath + '/www/lib'));
	App.use('/assets', express.static(this.config.basePath + '/www/assets'));
	
	App.get('/', (req, res) => res.render('landing'));
	App.get('/hfi', (req, res) => res.render('hfi'));
	//App.get('*', (req, res) => res.render('index'));
	
	App.use(morgan('dev'));
	
	App.use((err, req, res, next) =>
	{
		console.error(err.stack || err);
		res.render('error', {
			error: err,
			status: res.statusCode,
		});
	});
}
