const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const MinifyPlugin = require( 'babel-minify-webpack-plugin' );

const srcDir = path.resolve( __dirname, '../..' );
const distDir = path.resolve( __dirname, '../..' );
const fontsDir = distDir + '/assets/fonts/';
const cssDir = distDir + '/assets/css/';

module.exports = {
	context: srcDir,

	entry: [ './assets/js/index.js' ],

	output: {
		filename: './assets/js/editor.min.js',
		path: distDir,
		publicPath: '/'
	},

	module: {
		rules: [
			{
				test: /\.ejs$/,
				loader: 'ejs-loader'
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true
						}
					}
				]
			},
			{
				test: /\.js$/,
				use: [ 'babel-loader' ],
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					emitWarning: true
				}
			},
			{
				test: /\.(scss|css)$/,
				use: ExtractTextPlugin.extract( {
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						},
						{
							loader: 'sass-loader'
						}
					]
				} )
			},
			{
				test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
				loader: 'url-loader',
				query: {
					limit: 10000, // Use data url for assets <= 10KB
					name: 'static/[name].[hash].[ext]'
				}
			}
		]
	},

	plugins: [
		new MinifyPlugin(),

		new webpack.NamedModulesPlugin(),

		new CopyWebpackPlugin( [
			{
				from: srcDir + '/node_modules/jquery.stellar/jquery.stellar.js',
				to: distDir + '/assets/js/jquery-stellar'
			},
			{
				from: srcDir + '/node_modules/font-awesome/fonts',
				to: fontsDir
			},
			{
				from: srcDir + '/node_modules/font-awesome/css/font-awesome.min.css',
				to: cssDir
			},
			{
				from:
					srcDir +
					'/node_modules/boldgrid-theme-framework/boldgrid-theme-framework/assets/css/customizer/font-family-controls.min.css',
				to: cssDir
			}
		] )
	]
};
