import { createSSO } from '.'
import type { EveSSOAuth } from '.'

const CLIENT_ID = 'abcdef1234567890abcdef1234567890'
const REDIRECT_URI = 'http://localhost/callback'
const CODE_VERIFIER = 'f8tUrW6SUFiuKrhsN5azcptFt1aCm6svGfdrCDEw0='

describe('getUri', () => {
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

/*
describe('getAuthToken', () => {
  var auth: EveSSOAuth
  var accessToken: string

  var fetchToken: any

  beforeAll(async () => {
    const keyResponse = await generateKeyPair('RS256')
    accessToken = await new SignJWT({ 'urn:test:claim': 'this is a test' })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setIssuer('login.eveonline.com')
      .setAudience('urn:test:runner')
      .setSubject('this is a test')
      .setExpirationTime('2h')
      .sign(keyResponse.privateKey)
  })

  beforeEach(async () => {
    auth = createSSO({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    })

    const stateStub = sinon.stub(auth, 'generateState')
    stateStub.onCall(0).returns(Promise.resolve('12345678'))

    const MOCK_TOKEN = {
      json: async () => {
        return {
          access_token: accessToken,
          expires_in: 1199,
          token_type: 'Bearer',
          refresh_token: '1234567890abcedef'
        }
      }
    }

    const keyResponse = await generateKeyPair('RS256')
    const publicKey = keyResponse.publicKey

    console.log('publicKey', keyResponse)
    const keyStub = sinon.stub(auth, 'getPublicKey')
    keyStub.returns(Promise.resolve(publicKey))

    const fetchStub = sinon.stub(auth, '_fetchToken')
    fetchStub.returns(Promise.resolve(MOCK_TOKEN) as any)
  })

  it('it requests the url', async () => {
    await auth.getUri()

    await auth.getAuthToken('12345678', 'abcdef123456789')

    expect(fetchToken.callCount).toBe(1)

    const url = new URL(fetchToken.args[0][0])

    expect(url.protocol).toBe('https:')
    expect(url.host).toBe('login.eveonline.com')
    expect(url.pathname).toBe('/v2/oauth/token')
  })
})
*/