require('util').promisify = require('util.promisify');

var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

var wwwPath = __dirname + '/src/www';
var rustPath = __dirname + '/src/rust';
var destPath = __dirname + '/dist';

var config = {
	// mode: 'development', // TEMP
	entry: {
		app: wwwPath + '/app/main.js',
		module: wwwPath + '/app/module.js',
		// rust: wwwPath + '/app/rust.js',
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
		}, {
			test: /\.rs$/,
			use: [{
				loader: 'wasm-loader',
			}, {
				loader: 'rust-native-wasm-loader',
				options: {release: true},
			}]
	  }],
	},
	externals: {
		'fs': true,
		'path': true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true,
		// }),
		new ExtractTextPlugin('bundle/[name].css'),
	],
};

module.exports = config;
