import { getRandomString, createHash } from './util'
import { jwtVerify, KeyLike } from 'jose/jwt/verify'
import { parseJwk } from 'jose/jwk/parse'

interface EveSSOPCKEAuthConfig {
  clientId: string
  redirectUri: string
}

interface EveSSOUri {
  uri: string
  state: string
  codeVerifier: string
}

interface EveSSOToken {
  access_token: string
  expires_in: string
  token_type: string
  refresh_token: string
  payload?: EveSSOPayload
}

interface EveSSOPayload {
  jti: string
  kid: string
  sub: string
  azp: string
  tenant: string
  tier: string
  region: string
  owner: string
  exp: number
  iat: number
  iss: string
}

export function createSSO (config: EveSSOPCKEAuthConfig): EveSSOAuth {
  return new EveSSOAuth(config)
}

const BASE_URI = 'https://login.eveonline.com/'
const AUTHORIZE_PATH = '/v2/oauth/authorize'
const TOKEN_PATH = '/v2/oauth/token'
const REVOKE_PATH = '/v2/oauth/revoke'
const JWKS_URL = 'https://login.eveonline.com/oauth/jwks'

class EveSSOAuth {
  protected config: EveSSOPCKEAuthConfig
  protected publicKey!: KeyLike

  constructor (config: EveSSOPCKEAuthConfig) {
    this.config = config
  }

  async generateState (): Promise<string> {
    return await getRandomString(8)
  }

  async generateCodeVerifier (): Promise<string> {
    return await getRandomString(64)
  }

  async generateCodeChallenge (codeVerifier: string): Promise<string> {
    return await createHash(codeVerifier)
  }

  async _getJWKKeyData (): Promise<any> {
    try {
      const response = await fetch(JWKS_URL)
      return await response.json()
    } catch (error) {
      console.log('There was an error retreiving JWK data', error)
    }
  }

  async getPublicKey (): Promise<KeyLike> {
    if (this.publicKey === undefined) {
      try {
        const jwks = await this._getJWKKeyData()
        if (jwks !== null) {
          const key = jwks.keys.find((x: any) => x.alg === 'RS256')
          this.publicKey = await parseJwk(key)
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

  async verifyToken (token: EveSSOToken): Promise<EveSSOToken> {
    const publicKey = await this.getPublicKey()
    const { payload } = await jwtVerify(token.access_token, publicKey, {
      issuer: 'login.eveonline.com'
    })

    token.payload = payload as unknown as EveSSOPayload

    return token
  }

  async _fetchToken (url: string, init: object): Promise<Response> {
    return await fetch(url, init)
  }

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

  async revokeRefreshToken (token: EveSSOToken): Promise<void> {
    try {
      const form = new URLSearchParams()
      form.append('token_type_hint', 'refresh_token')
      form.append('token', token.refresh_token)
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
