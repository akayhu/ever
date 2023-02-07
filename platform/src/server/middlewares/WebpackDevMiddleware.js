"use strict";

import webpackDevMiddleware from "webpack-dev-middleware";

const WebpackDevMiddleware = (compiler, webpackDevConfig) => {
	return webpackDevMiddleware(compiler, {
		noInfo: false, 
		publicPath: webpackDevConfig.output.publicPath,
		stats: {
			colors: true 
		}
	});
}

export default WebpackDevMiddleware;