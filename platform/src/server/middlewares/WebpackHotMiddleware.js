"use strict";

import webpackHotMiddleware from "webpack-hot-middleware";

const WebpackHotMiddleware = (compiler, webpackDevConfig) => {
	return webpackHotMiddleware(compiler);
}

export default WebpackHotMiddleware;