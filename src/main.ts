/* eslint-disable */

/**
 * This file is for the dev server
 *
 * yarn dev
 */

import { createSSO, EveSSOAuth } from "."

var auth: EveSSOAuth

var config
var loginContainer
var clientId
var callbackUri

export function createAuth () {
  localStorage.setItem('clientId', clientId.value)
  localStorage.setItem('callbackUri', callbackUri.value)

  auth = createSSO({
    clientId: clientId.value,
    redirectUri: callbackUri.value
  })

  console.log(auth)

  config?.classList.add('hidden')
  loginContainer?.classList.remove('hidden')
}

export async function login () {
  const { uri, state, codeVerifier } = await auth.getUri()
  localStorage.setItem(state, codeVerifier)
  window.location = uri
}

window.addEventListener('load', async () => {
  // grab elements
  config = document.querySelector('#config')
  loginContainer = document.querySelector('#loginContainer')
  clientId = document.querySelector('#clientId')
  callbackUri = document.querySelector('#callbackUri')

  clientId.value = localStorage.getItem('clientId')
  callbackUri.value = localStorage.getItem('callbackUri')

  // add click listeners
  document.querySelector('#createAuth')?.addEventListener('click', createAuth)
  document.querySelector('#login')?.addEventListener('click', login)

  // check for callback
  const url = new URL(window.location)
  if (url.searchParams.has('state')) {
    auth = createSSO({
      method: 'pkce',
      clientId: clientId.value,
      redirectUri: callbackUri.value
    })
    const cv = localStorage.getItem(url.searchParams.get('state'))
    
    const token = await auth.getAccessToken(url.searchParams.get('code'), cv)
    console.log(token)
  } else {
    config?.classList.remove('hidden')
  }
})