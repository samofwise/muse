var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const webpack = require('webpack');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: { main: './src/main.tsx' },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		chunkFilename: '[name].bundle.js',
		publicPath: '/'
	},
	node: {
		global: false,
		fs: 'empty'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			// Placeholder for global used in any node_modules, avoids Content Security Policy script-src 'unsafe-eval'
			global: 'window'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.ejs',
			title: 'Alderaan',
			inject: 'body',
			alwaysWriteToDisk: true,
			hash: true
		}),
		new HtmlWebpackHarddiskPlugin()
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					},
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								strictMath: true
							}
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].v-[hash].[ext]',
							outputPath: 'images/'
						}
					}
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].v-[hash].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	}
};
