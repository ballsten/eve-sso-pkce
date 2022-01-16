[eve-sso-pkce](../README.md) / [Exports](../modules.md) / EveSSOToken

# Interface: EveSSOToken

This is the object returned from a successful authentication

## Table of contents

### Properties

- [access\_token](EveSSOToken.md#access_token)
- [expires\_in](EveSSOToken.md#expires_in)
- [payload](EveSSOToken.md#payload)
- [refresh\_token](EveSSOToken.md#refresh_token)
- [token\_type](EveSSOToken.md#token_type)

## Properties

### access\_token

• **access\_token**: `string`

the access token for use with the ESI API

#### Defined in

[src/index.ts:45](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L45)

___

### expires\_in

• **expires\_in**: `string`

the number of seconds until the access token expires

#### Defined in

[src/index.ts:50](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L50)

___

### payload

• `Optional` **payload**: [`EveSSOPayload`](EveSSOPayload.md)

Decoded access token. Useful for understanding what the token gives you access
to.

#### Defined in

[src/index.ts:66](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L66)

___

### refresh\_token

• **refresh\_token**: `string`

The refresh token is required to get a new access token after it has expired

#### Defined in

[src/index.ts:60](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L60)

___

### token\_type

• **token\_type**: `string`

This will aways be 'Bearer'

#### Defined in

[src/index.ts:55](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L55)
