require('dotenv').config('/..')
module.exports = function (redirectUrl) {
    var configFB = {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLINET_SECRET,
        callbackURL: redirectUrl
    }
    return configFB;
}