class OIDCClient {
    
    verifierStorageKey = "code_verifier";
    config;
    accessToken;
    oidcClaims;
    accessTokenExpiration;
    
    constructor(config) {
        console.log("Creating a new instance of OIDCClient");
        this.config = config;
    }

    async loginWithRedirect(parameters) {
        console.log("oauthAuthorize");
        let codeVerifier = this.generateCodeVerifier (128);
        let codeChallenge = await this.generateChallenge (codeVerifier);
        window.sessionStorage.setItem (this.verifierStorageKey,codeVerifier);
        let queryStringParams = {
            response_type: 'code',
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            ... parameters
        }
        let authUrl = this.config.azServerUrl + this.config.azEndpoint + "?" + new URLSearchParams(queryStringParams).toString ();
        window.location.replace(authUrl);
    }

    logoutWithRedirect() {
        console.log("oauthLogout");
        let queryStringParams = {
            post_logout_redirect_uri: this.config.redirectUri

        }
        let authUrl = this.config.azServerUrl + this.config.logoutEndpoint + "?" + new URLSearchParams(queryStringParams).toString ();
        window.location.replace(authUrl);
    }

    async handleRedirectBack() {
        const codeMatch = window.location.href.match('[?#&]code=([^&]*)');
        if (codeMatch && codeMatch[1]) {
            return await this.fetchTokens(codeMatch[1]);
        }
    }

    async fetchTokens(azCode) {
        console.log("fetchTokens  with code " + azCode);

        let codeVerifier = window.sessionStorage.getItem (this.verifierStorageKey);
        let bodyParams = {
            grant_type: 'authorization_code',
            code: azCode,
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            code_verifier: codeVerifier
        }

        console.log (bodyParams);
        let response = await fetch(this.config.azServerUrl + this.config.tokenEndpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(bodyParams).toString ()
        })

        let body = await response.json();
        this.accessToken = body.access_token;
        this.oidcClaims = this.verifyIdToken(body.id_token, this.config.azServerUrl, this.config.clientId).payload;
        this.accessTokenExpiration = Math.floor(Date.now() / 1000) + 1;
    }

    getOidcClaims () {
        return this.oidcClaims;
    }
    
    getAccessToken () {
        return this.accessToken;
    }

    isUserAuthenticated () {
        if (!this.oidcClaims) {
            return false;
        }

        if (this.isExpired (this.oidcClaims.exp)) {
            return false;
        }
        return true;
    }

    isNumber = n => typeof n === 'number';

    verifyIdToken(idToken, expectedIssuer, expectedAudience) {
        let decodedToken = this.decodeJWT(idToken);
        var aud = decodedToken.payload.aud;
        var sub = decodedToken.payload.sub;
        var iss = decodedToken.payload.iss;
        var exp = decodedToken.payload.exp;
        var iat = decodedToken.payload.iat;

        if (!iss || typeof iss !== 'string') {
            throw new Error("Issuer (iss) not present");
        }

        if (iss !== expectedIssuer) {
            throw new Error("Issuer (iss) mismatch")
        }

        if (!sub || typeof sub !== 'string') {
            throw new Error("Subject (sub) not present");
        }

        if (!aud || typeof aud !== 'string') {
            throw new Error("Audience (aud) not present");
        }

        if (aud !== expectedAudience) {
            throw new Error("Audience (aud) mismatch");
        }

        if (!exp || !this.isNumber(exp)) {
            throw new Error("Expiration Time (exp) not present");
        }

        if (this.isExpired (exp)) {
            throw new Error("Token expired");
        }

        if (!iat || !this.isNumber(exp)) {
            throw new Error("Issued At (iat) not present");
        }
        return decodedToken;
    }

    isExpired (exp) {
        let expTimeDate = new Date(0);
        expTimeDate.setUTCSeconds(exp);
        let now = new Date();

        if (now > expTimeDate) {
            return true;
        }
        return false;
    }

    decodeJWT(Jwt) {
        let parts = Jwt.split('.');
        let header;
        let payload;

        if (parts.length !== 3) {
            throw new Error('Malformed JWT');
        }

        header = JSON.parse(this.base64urlDecodeStr(parts[0]));
        payload = JSON.parse(this.base64urlDecodeStr(parts[1]));

        return {
            header: header,
            payload: payload,
            encoded: {
                header: parts[0],
                payload: parts[1],
                signature: parts[2]
            }
        };
    }

    base64urlDecodeStr(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        return atob(str);
    }

    base64urlEncodeStr(str) {
        const base64 = btoa (str);
        return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }

    generateCodeVerifier (length) {
        const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
        let randomArray = new Uint8Array(length);
        window.crypto.getRandomValues(randomArray);
        let randomString = "";
        randomArray.forEach (randomValue => {randomString += charset [randomValue % charset.length]})
        return randomString;
    }

    async generateChallenge (verifier) {
        const data = new TextEncoder ().encode (verifier);
        const digestBuffer = await window.crypto.subtle.digest ("SHA-256",data);
        const digestString = String.fromCharCode(...new Uint8Array(digestBuffer));
        return this.base64urlEncodeStr (digestString);
    }
}



