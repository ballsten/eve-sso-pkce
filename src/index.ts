import { isNode } from 'browser-or-node'
import base64url from 'base64url'
import { encode } from 'base64-arraybuffer'

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

async function getRandomString (length: number): Promise<string> {
  const numBytes = Math.floor(length / 2)
  if (isNode === true) {
    const { randomBytes } = await import('crypto')
    return randomBytes(numBytes).toString('hex')
  } else {
    const array = new Uint8Array(numBytes)
    window.crypto.getRandomValues(array)
    return ([...array].map(x => x.toString(16).padStart(2, '0')).join(''))
  }
}

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
    if (isNode === true) {
      const { createHash } = await import('crypto')
      return base64url.fromBase64(createHash('sha256').update(codeVerifier).digest('base64'))
    } else {
      const data = new TextEncoder().encode(codeVerifier)
      const digest = await window.crypto.subtle.digest('SHA-256', data)
      return base64url.fromBase64(encode(digest))
    }
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
