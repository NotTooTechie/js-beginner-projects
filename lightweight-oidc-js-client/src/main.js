let config = {
    azServerUrl: "https://auth.pingone.eu/ENV-ID/as",
    tokenEndpoint: "/token",
    azEndpoint: "/authorize",
    logoutEndpoint: "/signoff",
    clientId: "CLIENT-ID",
    redirectUri: "http://localhost:5500"
}

let oidcClient; 

function login () {
    console.log ("Login");
    oidcClient.loginWithRedirect ({scope: "openid profile email"});
}

function logout () {
    console.log ("Logout");
    oidcClient.logoutWithRedirect ();
    
}

function updateUI () {
    console.log ("updateUI");
    
    if (oidcClient.isUserAuthenticated) {
        document.querySelector (".firstname").innerText = oidcClient.getOidcClaims ().given_name;
        eachElement(".auth", (e) => e.classList.remove("d-none"));
        eachElement(".non-auth", (e) => e.classList.add("d-none"));
    } else {
        eachElement(".non-auth", (e) => e.classList.remove("d-none"));
        eachElement(".auth", (e) => e.classList.add("d-none"));
    }
}


function eachElement (selector, fn) {
    for (let e of document.querySelectorAll(selector)) {
      fn(e);
    }
  }

window.onload = async () => {
    console.log ("Runnig window.onload");
    if (!oidcClient) {
        oidcClient = new OIDCClient (config);
    }
    if (window.location.search.includes ("code=")) {
        console.log ("Redirect from OIDC authorization");
        await oidcClient.handleRedirectBack ();
        console.log (oidcClient.getOidcClaims ());
        console.log (oidcClient.getAccessToken());
        window.history.replaceState({}, document.title, window.location.pathname);
        updateUI ();
    }
}

