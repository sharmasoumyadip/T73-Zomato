module.exports = function (accessToken) {
    var requestOptions = {
        url: 'https://auth.bodybuilder89.hasura-app.io/v1/signup',
        method: 'POST',
        json: true,
        body: {
            "provider" : "facebook",
            "data" : {
                "access_token": accessToken,
            }
        }
    }
    return requestOptions;
}
