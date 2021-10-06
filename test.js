const { parseJwk } = require('jose/jwk/parse')

const key = {
  e: 'AQAB',
  kty: 'RSA',
  n: 'rDfAH_njHPdvmQK7fMdKZJPUbwR81UX-v1in-D2Hagv5cpEcZwR1H-TTSr388JgX0HDLg9z_lkM76HACGiS_h8qaewDqXdtuTydf7Ihyr9xM-jbrMEHAcO4eSIuQKFPhVzJ2usnOAyC42sjjepOahd2IZjEtYMgr_DKxm7wZTfY6u6YrZIpQew3A_HZNRgYgdmqNX4S83qwA0z1zPedoqF2o-om7S972e00MNWZG9D8pHk_kSSaWJPUBxrmiNrx0WQvFRpho7QzYtDhKRaDZ_N3id4PQ7RFJWYQNGbNoeeSpwBJvQP1iPucPD2E0A58pCbm45J0Fv41VkD83Ow8-TQ',
  alg: 'RS256'
}

async function test () {
  const publicKey = await parseJwk(key)
  console.log(publicKey)
}

test()