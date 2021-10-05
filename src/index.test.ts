import { createSSO } from '.'
import { expect } from 'chai'

const CLIENT_ID = 'abcdef1234567890abcdef1234567890'
const REDIRECT_URI = 'http://localhost/callback'

describe('getUri', () => {
  it('it will generate correct Uri', async () => {
    const auth = createSSO({
      method: 'pkce',
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    })

    const scopes = [
      'scope-1',
      'scope-2'
    ]

    const uri = await auth.getUri(scopes)
    const url = new URL(uri)

    expect(url.protocol).to.equal('https:')
    expect(url.host).to.equal('login.eveonline.com')
    expect(url.pathname).to.equal('/v2/oauth/authorize')
  })

  it('it sets the right paramaters')
  it('it creates the right code_challenge')
})
