# eve-sso-pkce
An Eve Online SSO library for browser that uses the PKCE method.

I created this project because I couldn't find an existing package. This library implements the [OAuth 2.0 for Mobile or Desktop Applications](https://docs.esi.evetech.net/docs/sso/native_sso_flow.html) for EVE Online SSO.

I use this package for authetnication in browser-only SPAs, where it is not possible to keep the Secret Key a secret.

## Docs
Auto-generated documentation is [available](./docs/modules.md)

## Examples

This package provides the API to manage the authetnication workflow with EVE Online SSO. It is the implementor's responsibility to manage the clients part of the workflow. Here is an example of how to use this package:

1. import and create the EveAuthSSO object. The clientId and redirectUri are accessible from the [developer portal](https://developers.eveonline.com/)
```
import { createSSO } from 'eve-sso-pkce'
const sso = createSSO({
  clientId: 'MY-CLIENT-ID',
  redirectUri: 'https://my.callback.uri/path'
})
```

2. get the auth URI and redirect the client there
```
// get the uri for the required scopes
const ssoUri = await sso.getUri(['esi-location.read_location.v1')

// redirect the browser to the uri
window.location.assign(ssoUri.uri)
```

3. listen for the response on the callback uri and then get the access token
```
// get the response from the auth server. I use Vue Router to redirect to a component
import { useRoute } from 'vue-router'
const route = useRoute()

// get the query parameters
const state = route.query.state?.toString()
const code = route.query.code?.toString() 

// check the state is right
if(ssoUri.state !== state) {
  throw new Error('state should match')
}

// request the access token
const token = await sso.getAccessToken(code, ssoUri.codeVerifier)

// You can then use token.accessToken for esi service calls (sold seperately! :lol: )
```

4. refresh token when required
```
// get a new access token when the last one expired
const newToken = await sso.refreshToken(token.refreshToken)
```

5. revoke the token - best to do when the user logs out
```
sso.### revokeRefreshToken(newToken.refreshToken)
```