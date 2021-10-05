import { getRandomString, createHash } from './util'

interface EveSSOPCKEAuthConfig {
  method: 'pkce'
  clientId: string
  redirectUri: string
}

export function createSSO (config: EveSSOPCKEAuthConfig): EveSSOAuth {
  return new EveSSOAuth(config)
}

const BASE_URI = 'https://login.eveonline.com/'
const AUTHORIZE_PATH = '/v2/oauth/authorize'

class EveSSOAuth {
  protected config: EveSSOPCKEAuthConfig
  protected states = new Map<string, string>()

  constructor (config: EveSSOPCKEAuthConfig) {
    this.config = config
  }

  async generateState (): Promise<string> {
    return await getRandomString(8)
  }

  async generateCodeVerifier (): Promise<string> {
    return await getRandomString(32)
  }

  async generateCodeChallenge (codeVerifier: string): Promise<string> {
    return await createHash(codeVerifier)
  }

  async getUri (scope: string[] = []): Promise<string> {
    const state = await this.generateState()
    const codeVerifier = await this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)

    this.states.set(state, codeVerifier)

    const url = new URL(AUTHORIZE_PATH, BASE_URI)

    url.searchParams.append('response_type', 'code')
    url.searchParams.append('redirect_uri', this.config.redirectUri)
    url.searchParams.append('client_id', this.config.clientId)
    url.searchParams.append('code_challenge', codeChallenge)
    url.searchParams.append('code_challenge_method', 'S256')
    url.searchParams.append('scope', scope.join(' '))
    url.searchParams.append('state', state)

    return url.toString()
  }
}

export type { EveSSOAuth }
