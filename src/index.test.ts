import { createSSO } from '.'
import type { EveSSOAuth } from '.'

const CLIENT_ID = 'abcdef1234567890abcdef1234567890'
const REDIRECT_URI = 'http://localhost/callback'
const CODE_VERIFIER = 'f8tUrW6SUFiuKrhsN5azcptFt1aCm6svGfdrCDEw0='

describe('>> getUri', () => {
  var auth: EveSSOAuth

  const scopes = [
    'scope-1',
    'scope-2'
  ]

  beforeEach(() => {
    auth = createSSO({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    })
  })

  it('it will generate correct Uri', async () => {
    const { uri } = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.protocol).toBe('https:')
    expect(url.host).toBe('login.eveonline.com')
    expect(url.pathname).toBe('/v2/oauth/authorize')
  })

  it('it sets the right paramaters', async () => {
    const { uri } = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('redirect_uri')).toBe(REDIRECT_URI)
    expect(url.searchParams.get('client_id')).toBe(CLIENT_ID)
    expect(url.searchParams.get('scope')).toBe(scopes.join(' '))
    expect(url.searchParams.get('state')).toHaveLength(8)
  })

  it('it creates the right code_challenge', async () => {
    auth.generateCodeVerifier = jest.fn(() => { return Promise.resolve(CODE_VERIFIER) })
    const { uri } = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.searchParams.get('code_challenge')).toBe('IUsIJxtFfzTHF5C7Yu7mMqPs7ErAmUfZ1Ol_MtXwOVA')
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
  })
})

describe('>> getAccessToken', () => {
  it.todo('it requests the url')
  it.todo('returns the token')
})

describe('>> refreshToken', () => {
 it.todo('requests the right url')
 it.todo('returns the token')
})

describe('>> revokeRefreshToken', () => {
 it.todo('requests the right url')
})
