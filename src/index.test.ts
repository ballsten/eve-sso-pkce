import { createSSO } from '.'
import { expect } from 'chai'
import type { EveSSOAuth } from '.'

const CLIENT_ID = 'abcdef1234567890abcdef1234567890'
const REDIRECT_URI = 'http://localhost/callback'

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

  it('it sets the right paramaters')
  it('it creates the right code_challenge')
})
