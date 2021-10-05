import base64url from 'base64url'
import { encode } from 'base64-arraybuffer'

export async function getRandomString (length: number): Promise<string> {
  const numBytes = Math.floor(length / 2)
  const array = new Uint8Array(numBytes)
  window.crypto.getRandomValues(array)
  return ([...array].map(x => x.toString(16).padStart(2, '0')).join(''))
}

export async function createHash (payload: string): Promise<string> {
  const data = new TextEncoder().encode(payload)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return base64url.fromBase64(encode(digest))
}
