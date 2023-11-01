import { getRandomString, createHash } from './util'
import { jwtVerify, importJWK, KeyLike } from 'jose'

/**
 * Config object for creating the EveSSOAuth instance
 */
export interface EveSSOPCKEAuthConfig {
  /**
   * This is the clientID that is created in the EVE Developers portal
   */
  clientId: string
  /**
   * This is the redirect Uri that you specified in the EVE Developers portal.
   */
  redirectUri: string
}

/**
 * A URI object for initiating authentication
 */
export interface EveSSOUri {
  /**
   * the uri to eve auth that the client must be redirected to
   */
  uri: string

  /**
   * The generated state string
   */
  state: string

  /**
   * The generated code verifer. Must be saved for later use.
   */
  codeVerifier: string
}

/**
 * This is the object returned from a successful authentication
 */
export interface EveSSOToken {
  /**
   * the access token for use with the ESI API
   */
  access_token: string

  /**
   * the number of seconds until the access token expires
   */
  expires_in: string

  /**
   * This will aways be 'Bearer'
   */
  token_type: string

  /**
   * The refresh token is required to get a new access token after it has expired
   */
  refresh_token: string

  /**
   * Decoded access token. Useful for understanding what the token gives you access
   * to.
   */
  payload?: EveSSOPayload
}

/**
 * Eve SSO Token
 *
 * You can probably find out more about what these values are by reading
 * the ESI docs
 */
export interface EveSSOPayload {
  scp: string
  jti: string
  kid: string
  sub: string
  azp: string
  tenant: string
  tier: string
  region: string
  name: string
  owner: string
  exp: number
  iat: number
  iss: string
}

/**
 * Returns an new instance of EveSSOAuth
 *
 * @remarks
 *
 * This function is the main export of the package. It is used to instatiate the EveSSOAuth class.
 *
 * @param config - A config object
 * @param fetch - Dependency injection for fetch, do not use unless you know what you are doing
 * @returns A EveSSOAuth object
 */
export function createSSO (config: EveSSOPCKEAuthConfig, fetch = window.fetch): EveSSOAuth {
  return new EveSSOAuth(config, fetch)
}

// EVE SSO endpoints
const BASE_URI = 'https://login.eveonline.com/'
const AUTHORIZE_PATH = '/v2/oauth/authorize'
const TOKEN_PATH = '/v2/oauth/token'
const REVOKE_PATH = '/v2/oauth/revoke'
const JWKS_URL = 'https://login.eveonline.com/oauth/jwks'

/**
 * EveSSOAuth provides an interface for all SSO operations
 *
 * @remarks
 *
 * This class should be created using the createSSO function
 */
class EveSSOAuth {
  /**
   * @hidden
   */
  protected config: EveSSOPCKEAuthConfig
  /**
   * @hidden
   */
  protected publicKey!: KeyLike
  /**
   * @hidden
   */
  private readonly fetch: typeof window.fetch

  constructor (config: EveSSOPCKEAuthConfig, fetchParam = window.fetch) {
    this.fetch = fetchParam.bind(window)

    this.config = config
  }

  /**
   * internal method for generating a random state string
   * @hidden
   */
  async generateState (): Promise<string> {
    return await getRandomString(8)
  }

  /**
   * internal method for generating a code verifier
   * @hidden
   */
  async generateCodeVerifier (): Promise<string> {
    return await getRandomString(64)
  }

  /**
   * internal method for generating the code challenge
   * @hidden
   */
  async generateCodeChallenge (codeVerifier: string): Promise<string> {
    return await createHash(codeVerifier)
  }

  /**
   * internal method that gets the JWK Key Data from ESI
   * @hidden
   */ 
  async _getJWKKeyData (): Promise<any> {
    try {
      const response = await fetch(JWKS_URL)
      return await response.json()
    } catch (error) {
      console.log('There was an error retreiving JWK data', error)
    }
  }

  /**
   * internal method for extracting the public key from JWK Key Data
   * @hidden
   */
  async getPublicKey (): Promise<KeyLike> {
    if (this.publicKey === undefined) {
      try {
        const jwks = await this._getJWKKeyData()
        if (jwks !== null) {
          const key = jwks.keys.find((x: any) => x.alg === 'RS256')
          this.publicKey = await importJWK(key) as KeyLike
          return this.publicKey
        } else {
          throw new Error('There was a problem obtaining public key')
        }
      } catch (error) {
        console.log('There was an error retreiving the public key:', error)
      }
    }

    return this.publicKey
  }

  /**
   * Returns the an EveSSOUri that contains all the details required to progress
   * with Authentication. The returned object should be retained for use in the
   * next steps.
   *
   * The client should be redirected to the EveSSOUri.uri
   *
   * @param scope - an array of strings for the scopes to request access to.
   * @returns an EveSSOUri object
   */
  async getUri (scope: string[] = []): Promise<EveSSOUri> {
    const state = await this.generateState()
    const codeVerifier = await this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)

    const url = new URL(AUTHORIZE_PATH, BASE_URI)

    url.searchParams.append('response_type', 'code')
    url.searchParams.append('redirect_uri', this.config.redirectUri)
    url.searchParams.append('client_id', this.config.clientId)
    url.searchParams.append('code_challenge', codeChallenge)
    url.searchParams.append('code_challenge_method', 'S256')
    url.searchParams.append('scope', scope.join(' '))
    url.searchParams.append('state', state)

    return {
      uri: url.toString(),
      state,
      codeVerifier
    }
  }

  /**
   * internal method for verifying the token. This method sets the payload if
   * verification is successful
   * @hidden
   */
  async verifyToken (token: EveSSOToken): Promise<EveSSOToken> {
    const publicKey = await this.getPublicKey()
    const { payload } = await jwtVerify(token.access_token, publicKey, {
      issuer: 'https://login.eveonline.com'
    })

    token.payload = payload as unknown as EveSSOPayload

    return token
  }

  /**
   * internal method for fetching the token
   * @hidden
   */
  async _fetchToken (url: string, init: object): Promise<Response> {
    return await this.fetch(url, init)
  }

  /**
   * This method gets the access token after the user has authenticated. You
   * will need to capture the response from the callback URL and extract the
   * state and code from the query parameters
   *
   * Use the state parameter to retreive the codeVerifier that was returned from
   * getUri. Pass in the code and codeVerifier into this function
   *
   * @param code - code returned from the auth serve
   * @param codeVerifier - the code verifier generated from {@link EveSSOAuth.getUri | getUri}
   * @returns A Promise of the EveSSOToken
   */
  async getAccessToken (code: string, codeVerifier: string): Promise<EveSSOToken> {
    try {
      const form = new URLSearchParams()
      form.append('grant_type', 'authorization_code')
      form.append('code', code)
      form.append('client_id', this.config.clientId)
      form.append('code_verifier', codeVerifier)

      const url = new URL(TOKEN_PATH, BASE_URI).toString()

      const response = await this._fetchToken(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Host: 'login.eveonline.com'
        },
        body: form
      })

      const token = await this.verifyToken(await response.json())

      return token
    } catch (error) {
      console.log('There was an error retreiving the token:', error)
      throw error
    }
  }

  /**
   * Refresh your OAuth token
   * @param refreshToken - refresh token to use
   * @param scopes - array of scopes to refresh for (optional)
   * @returns a Promise of a new EveSSOToken
   */
  async refreshToken (refreshToken: string, scopes?: string[]): Promise<EveSSOToken> {
    try {
      const form = new URLSearchParams()
      form.append('grant_type', 'refresh_token')
      form.append('refresh_token', refreshToken)
      form.append('client_id', this.config.clientId)
      if (scopes !== undefined) form.append('scope', scopes.join(' '))

      const url = new URL(TOKEN_PATH, BASE_URI).toString()

      const response = await this._fetchToken(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Host: 'login.eveonline.com'
        },
        body: form
      })

      const token = await this.verifyToken(await response.json())

      return token
    } catch (error) {
      console.log('There was an error retreiving the token:', error)
      throw error
    }
  }

  /**
   * Revoke refresh token
   * @param refreshToken - refresh token that you want to revoke
   */
  async revokeRefreshToken (refreshToken: string): Promise<void> {
    try {
      const form = new URLSearchParams()
      form.append('token_type_hint', 'refresh_token')
      form.append('token', refreshToken)
      form.append('client_id', this.config.clientId)

      const url = new URL(REVOKE_PATH, BASE_URI).toString()

      const headers = new Headers()

      headers.set('Content-Type', 'application/x-www-form-urlencoded')
      headers.set('Host', 'login.eveonline.com')

      await this._fetchToken(url, {
        method: 'POST',
        headers,
        body: form
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export type { EveSSOAuth }
