"use strict";
function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}
const ApiCheckRefer = () => (req, res, next) => {
    const referer = req.get('referer');
    const env = process.env.NODE_ENV.toLowerCase();
    
    if (env === 'dev') {
        next();
    } else if (!referer) {
        next();
    } else if ( referer ) {
        if(getHostName(referer).indexOf('104.com') > -1) {
            next();
        }
        else if(getHostName(referer).indexOf('104-dev.com') > -1) {
            next();
        }
        else if(getHostName(referer).indexOf('104-staging.com') > -1) {
            next();
        }
        else if(/localhost/gi.test(referer)){
            next();
        }
        else if(/amazonaws\.com/gi.test(referer)){
            next();
        }
        else {
            res.status(403).json({
                errorCode : 403,
                errorMsg : 'Access Denied'
            });
        }
    }
}

export default ApiCheckRefer;