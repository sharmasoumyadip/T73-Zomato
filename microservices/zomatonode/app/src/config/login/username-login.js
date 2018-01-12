module.exports = function (username, password) {
    var requestOptions = {
        url: 'https://auth.bodybuilder89.hasura-app.io/v1/login',
        method: 'POST',
        json: true,
        body: {
            "provider": "username",
            "data": {
                "username": username,
                "password": password
            }
        }
    };
    return requestOptions;
}
