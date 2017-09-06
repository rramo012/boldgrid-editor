const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const config = require( './local.dev.js' );

const distDir = path.resolve( __dirname, '../..' );

var webpackConfig = {
	context: path.resolve( __dirname, '../..' ),

	entry: [ './assets/js/index.js' ],

	output: {
		filename: './assets/js/editor.min.js',
		path: distDir,
		publicPath: '/',
		sourceMapFilename: './assets/js/editor.min.map'
	},

	devServer: {
		contentBase: path.resolve( __dirname, '../..' ),
		publicPath: '/',
		historyApiFallback: true,
		port: 4000,
		overlay: {
			errors: true,
			warnings: true
		}
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
				use: [ 'babel-loader' ]
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				loader: 'eslint-loader',
				options: {
					emitWarning: true
				}
			},
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
				loader: 'url-loader',
				query: {
					limit: 10000, // Use data url for assets <= 10KB
					name: 'static/images/[name].[hash].[ext]'
				}
			}
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),

		new webpack.NamedModulesPlugin()
	]
};

if ( config.devServer.proxy ) {
	webpackConfig.devServer.proxy = config.devServer.proxy;
}

module.exports = webpackConfig;
