const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const srcDir = path.resolve( __dirname, '../..' );
const distDir = path.resolve( __dirname, '../..' );

module.exports = {
	context: srcDir,

	devtool: 'source-map',

	entry: [ './assets/js/index.js' ],

	output: {
		filename: './assets/js/editor.min.js',
		path: distDir,
		publicPath: '/',
		sourceMapFilename: './assets/js/editor.min.map'
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
				exclude: /node_modules/,
				use: [ 'babel-loader' ]
			},
			/*{
      test: /\.js$/,
      enforce: 'pre',

      loader: 'eslint-loader',
      options: {
		  emitWarning: true
      }
  },*/ {
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
		new webpack.optimize.UglifyJsPlugin(),

		new webpack.NamedModulesPlugin()
	]
};
