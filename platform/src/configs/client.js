"use strict";

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
const clientConfig = require("./client."+(canUseDOM?window.env:process.env.NODE_ENV)+".js").default;

export default clientConfig;