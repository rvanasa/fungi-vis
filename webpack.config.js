var webpack = require('webpack');

// var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isBuild = ENV === 'build';

var srcPath = __dirname + '/www';
var destPath = __dirname + '/dist';
var rustPath = __dirname + '/lib';

var config = {
	entry: {
		app: srcPath + '/app/main.js',
		module: srcPath + '/app/module.js',
	},
	output: {
		path: destPath,
		publicPath: '/',
		// filename: isBuild ? '[name].[hash].js' : '[name].bundle.js',
		// chunkFilename: isBuild ? '[name].[hash].js' : '[name].bundle.js',
		filename: 'bundle/[name].js',
		chunkFilename: 'bundle/[name].js',
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.css$/,
			loader: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader?sourceMap',
			}),
		}, {
			test: /\.html$/,
			loader: 'html-loader',
		}, {
			test: /\.(png|jpg|ico)$/,
			loader: 'file-loader',
		}/*, {
			test: /\.rs$/,
			use: {
			  loader: 'rust-wasm-loader',
			  options: {
				path: rustPath,
			  }
			}
		  }*/],
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true,
		// }),
		// new HtmlWebpackPlugin({
		// 	// chunks: ['app'],
		// 	template: srcPath + '/../view/webapp.ejs',
		// 	inject: 'head',
		// }),
		new ExtractTextPlugin('bundle/[name].css'),
	],
};

if(isBuild)
{
	config.plugins.push(new CopyPlugin([{from: srcPath}]));
}

module.exports = config;