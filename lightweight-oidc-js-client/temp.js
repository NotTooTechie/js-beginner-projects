refreshTokens(refreshToken) {
    return new Promise((resolve, reject) => {
        console.log("refreshToken with refresh token " + refreshToken);
        fetch(this.config.azServerUrl + this.config.tokenEndpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "grant_type=refresh_token&refresh_token=" + refreshToken + "&client_id=" + this.config.clientId + "&redirect_uri=" + this.config.redirectUri
        })
            .then((response) => {
                console.log(response);
                response.json()
                    .then((body) => {
                        console.log("ID Token " + body.id_token);
                        body.claims = this.verifyIdToken(body.id_token, this.config.azServerUrl, this.config.clientId).payload;
                        body.expires_at = Math.floor(Date.now() / 1000) + body.expires_in;
                        resolve(body);
                    }
                    );
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
    });
}

getFreshTokens(currentTokens) {
    console.log("getFreshTokens");
    let expTimeDate = new Date(0);
    expTimeDate.setUTCSeconds(currentTokens.expires_at);
    console.log(expTimeDate);
    console.log(currentTokens.expires_at);

    if (expTimeDate >= new Date()) {
        console.log("Token valid - returning cached token");
        return new Promise((resolve) => {
            resolve(currentTokens);
        });

    } else {
        console.log("Token expired - refreshing token");
        return this.config.refreshTokens(currentTokens.refresh_token);
    }

}