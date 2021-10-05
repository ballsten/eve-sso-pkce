import { expect } from 'chai'
import { fake } from 'sinon'

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
      method: 'pkce',
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    })
  })

  it('it will generate correct Uri', async () => {
    const uri = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.protocol).to.equal('https:')
    expect(url.host).to.equal('login.eveonline.com')
    expect(url.pathname).to.equal('/v2/oauth/authorize')
  })

  it('it sets the right paramaters', async () => {
    const uri = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.searchParams.get('response_type')).to.equal('code')
    expect(url.searchParams.get('redirect_uri')).to.equal(REDIRECT_URI)
    expect(url.searchParams.get('client_id')).to.equal(CLIENT_ID)
    expect(url.searchParams.get('scope')).to.equal(scopes.join(' '))
    expect(url.searchParams.get('state')).to.have.lengthOf(8)
  })

  it('it creates the right code_challenge', async () => {
    auth.generateCodeVerifier = fake(() => { return CODE_VERIFIER })
    const uri = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.searchParams.get('code_challenge')).to.equal('IUsIJxtFfzTHF5C7Yu7mMqPs7ErAmUfZ1Ol_MtXwOVA')
    expect(url.searchParams.get('code_challenge_method')).to.equal('S256')
  })
})

describe('getAuthToken', () => {
  /*
  var auth: EveSSOAuth

  beforeEach(() => {
    auth = createSSO({
      method: 'pkce',
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    })
  })
  */

  it('it requests the url', async () => {
    /*
    const uri = await auth.getUri()
    const state = new URL(uri).searchParams.get('state')

    auth.getAuthToken(state!, 'abcdef123456789')

    expect(mockedAxios.post).to.equalCalled()

    const url = new URL(mockedAxios.post.mock.calls[0][0])

    expect(url.protocol).to.equal('https:')
    expect(url.host).to.equal('login.eveonline.com')
    expect(url.pathname).to.equal('/v2/oauth/token')
    */
  })
})