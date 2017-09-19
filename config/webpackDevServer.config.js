'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function(proxy, allowedHost) {
  return {
    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    host: host,
    overlay: false,
    historyApiFallback: true,
    public: allowedHost,
    proxy,
    setup(app) {
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
    },
  };
};
