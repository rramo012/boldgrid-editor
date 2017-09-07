const env = process.env.NODE_ENV || 'development';

function buildConfig( env ) {
	return require( './tools/config/webpack.' + env + '.js' );
}

module.exports = buildConfig( 'production' === env ? 'prod' : 'dev' );
