import { createSSO, EveSSOAuth, EveSSOToken } from '.'

const CLIENT_ID = 'abcdef1234567890abcdef1234567890'
const REDIRECT_URI = 'http://localhost/callback'
const CODE_VERIFIER = 'f8tUrW6SUFiuKrhsN5azcptFt1aCm6svGfdrCDEw0='

var auth: EveSSOAuth

// mocks
const mockJSON = jest.fn()
const mockFetch = jest.fn().mockResolvedValue({
  json: mockJSON
})

beforeEach(() => {
  jest.clearAllMocks()
})

const currentTime = Math.trunc(new Date().getTime() / 1000)
export const mockToken = (): EveSSOToken => ({
  access_token: '1234567890abcdef',
  expires_in: '1199',
  token_type: 'Bearer',
  refresh_token: 'abcdefgh',
  payload: {
    scp: 'scope.1',
    jti: 'abfsdahjkdsf',
    kid: 'JWT-Signature-Key',
    sub: 'CHARACTER:EVE:1111111111',
    azp: '11288rfgsdfg634534534f349d654b560',
    tenant: 'tranquility',
    tier: 'live',
    region: 'world',
    name: 'Caldari Navy Issue Citizen',
    owner: 'jhdf9asd0fj0ds9j',
    exp: currentTime + 1199,
    iat: currentTime,
    iss: 'unit.test'
  }
})

const scopes = [
  'scope-1',
  'scope-2'
]

beforeEach(() => {
  auth = createSSO({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI
  }, mockFetch)
})

describe('>> getUri', () => {
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
  it('it requests the url', async () => {
    mockJSON.mockResolvedValueOnce({
      access_token: ''
    })
    const token = mockToken()
    auth.verifyToken = jest.fn().mockResolvedValue(token)

    await auth.getAccessToken('test-code', 'codeVerifier')
    expect(mockFetch).toBeCalled()
    const url = new URL(mockFetch.mock.calls[ 0 ][ 0 ])
    expect(url.host).toBe('login.eveonline.com')
    expect(url.pathname).toBe('/v2/oauth/token')

    const config = mockFetch.mock.calls[ 0 ][ 1 ]
    expect(config.method).toBe('POST')
    expect(config.body.get('grant_type')).toBe('authorization_code')
    expect(config.body.get('code')).toBe('test-code')
    expect(config.body.get('code_verifier')).toBe('codeVerifier')
    expect(config.body.get('client_id')).toBe(CLIENT_ID)

  })

  it('returns the token', async () => {
    mockJSON.mockResolvedValueOnce({
      access_token: ''
    })
    const token = mockToken()
    auth.verifyToken = jest.fn().mockResolvedValue(token)

    const result = await auth.getAccessToken('test-code', 'codeVerifier')
    expect(result).toStrictEqual(token)
  })
})

describe('>> refreshToken', () => {
  it('requests the right url', async () => {
    mockJSON.mockResolvedValueOnce({
      access_token: ''
    })
    const token = mockToken()
    auth.verifyToken = jest.fn().mockResolvedValue(token)
    
    await auth.refreshToken('test-refresh')

    expect(mockFetch).toBeCalled()
    const url = new URL(mockFetch.mock.calls[ 0 ][ 0 ])
    expect(url.host).toBe('login.eveonline.com')
    expect(url.pathname).toBe('/v2/oauth/token')

    const config = mockFetch.mock.calls[ 0 ][ 1 ]
    expect(config.method).toBe('POST')
    expect(config.body.get('grant_type')).toBe('refresh_token')
    expect(config.body.get('refresh_token')).toBe('test-refresh')
  })

  it('returns the token', async () => {
    mockJSON.mockResolvedValueOnce({
      access_token: ''
    })
    const token = mockToken()
    auth.verifyToken = jest.fn().mockResolvedValue(token)
    
    const result = await auth.getAccessToken('test-code', 'codeVerifier')
    expect(result).toStrictEqual(token)
  })
})

describe('>> revokeRefreshToken', () => {
  it('requests the right url', async () => {
    mockJSON.mockResolvedValueOnce({
      access_token: ''
    })
    
    await auth.revokeRefreshToken('refresh-token')

    expect(mockFetch).toBeCalled()
    const url = new URL(mockFetch.mock.calls[ 0 ][ 0 ])
    expect(url.host).toBe('login.eveonline.com')
    expect(url.pathname).toBe('/v2/oauth/revoke')

    const config = mockFetch.mock.calls[ 0 ][ 1 ]
    expect(config.method).toBe('POST')
    expect(config.body.get('token_type_hint')).toBe('refresh_token')
    expect(config.body.get('token')).toBe('refresh-token')
  })
})
