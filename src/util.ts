import { isNode } from 'browser-or-node'
import base64url from 'base64url'
import { encode } from 'base64-arraybuffer'

export async function getRandomString (length: number): Promise<string> {
  const numBytes = Math.floor(length / 2)
  if (isNode) {
    const { randomBytes } = await import('crypto')
    return randomBytes(numBytes).toString('hex')
  } else {
    const array = new Uint8Array(numBytes)
    window.crypto.getRandomValues(array)
    return ([...array].map(x => x.toString(16).padStart(2, '0')).join(''))
  }
}

export async function createHash (payload: string): Promise<string> {
  if (isNode) {
    const { createHash } = await import('crypto')
    return base64url.fromBase64(createHash('sha256').update(payload).digest('base64'))
  } else {
    const data = new TextEncoder().encode(payload)
    const digest = await window.crypto.subtle.digest('SHA-256', data)
    return base64url.fromBase64(encode(digest))
  }
}
