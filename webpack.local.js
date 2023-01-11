const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		compress: true,
		historyApiFallback: true,
		https: false,
		index: 'index.html',
		hot: true,
		open: true,
		port: 44390
	}
});
