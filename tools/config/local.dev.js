module.exports = {
	wordpressPath: 'wordpress/',
	devServer: {
		proxy: {
			'/wordpress': {
				target: 'http://localhost',
				secure: false
			}
		}
	}
};
