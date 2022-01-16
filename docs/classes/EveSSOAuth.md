[eve-sso-pkce](../README.md) / [Exports](../modules.md) / EveSSOAuth

# Class: EveSSOAuth

EveSSOAuth provides an interface for all SSO operations

**`remarks`**

This class should be created using the createSSO function

## Table of contents

### Constructors

- [constructor](EveSSOAuth.md#constructor)

### Properties

- [config](EveSSOAuth.md#config)
- [fetch](EveSSOAuth.md#fetch)
- [publicKey](EveSSOAuth.md#publickey)

### Methods

- [\_fetchToken](EveSSOAuth.md#_fetchtoken)
- [\_getJWKKeyData](EveSSOAuth.md#_getjwkkeydata)
- [generateCodeChallenge](EveSSOAuth.md#generatecodechallenge)
- [generateCodeVerifier](EveSSOAuth.md#generatecodeverifier)
- [generateState](EveSSOAuth.md#generatestate)
- [getAccessToken](EveSSOAuth.md#getaccesstoken)
- [getPublicKey](EveSSOAuth.md#getpublickey)
- [getUri](EveSSOAuth.md#geturi)
- [refreshToken](EveSSOAuth.md#refreshtoken)
- [revokeRefreshToken](EveSSOAuth.md#revokerefreshtoken)
- [verifyToken](EveSSOAuth.md#verifytoken)

## Constructors

### constructor

• **new EveSSOAuth**(`config`, `fetchParam?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | [`EveSSOPCKEAuthConfig`](../interfaces/EveSSOPCKEAuthConfig.md) | `undefined` |
| `fetchParam` | (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> & (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> | `window.fetch` |

#### Defined in

[src/index.ts:125](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L125)

## Properties

### config

• `Protected` **config**: [`EveSSOPCKEAuthConfig`](../interfaces/EveSSOPCKEAuthConfig.md)

#### Defined in

[src/index.ts:121](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L121)

___

### fetch

• `Private` `Readonly` **fetch**: (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> & (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\>

#### Defined in

[src/index.ts:123](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L123)

___

### publicKey

• `Protected` **publicKey**: `KeyLike`

#### Defined in

[src/index.ts:122](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L122)

## Methods

### \_fetchToken

▸ **_fetchToken**(`url`, `init`): `Promise`<`Response`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `init` | `object` |

#### Returns

`Promise`<`Response`\>

#### Defined in

[src/index.ts:222](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L222)

___

### \_getJWKKeyData

▸ **_getJWKKeyData**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[src/index.ts:147](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L147)

___

### generateCodeChallenge

▸ **generateCodeChallenge**(`codeVerifier`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `codeVerifier` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/index.ts:142](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L142)

___

### generateCodeVerifier

▸ **generateCodeVerifier**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[src/index.ts:137](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L137)

___

### generateState

▸ **generateState**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[src/index.ts:132](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L132)

___

### getAccessToken

▸ **getAccessToken**(`code`, `codeVerifier`): `Promise`<[`EveSSOToken`](../interfaces/EveSSOToken.md)\>

This method gets the access token after the user has authenticated. You
will need to capture the response from the callback URL and extract the
state and code from the query parameters

Use the state parameter to retreive the codeVerifier that was returned from
getUri. Pass in the code and codeVerifier into this function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code returned from the auth serve |
| `codeVerifier` | `string` | the code verifier generated from [getUri](EveSSOAuth.md#geturi) |

#### Returns

`Promise`<[`EveSSOToken`](../interfaces/EveSSOToken.md)\>

A Promise of the EveSSOToken

#### Defined in

[src/index.ts:238](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L238)

___

### getPublicKey

▸ **getPublicKey**(): `Promise`<`KeyLike`\>

#### Returns

`Promise`<`KeyLike`\>

#### Defined in

[src/index.ts:157](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L157)

___

### getUri

▸ **getUri**(`scope?`): `Promise`<[`EveSSOUri`](../interfaces/EveSSOUri.md)\>

Returns the an EveSSOUri that contains all the details required to progress
with Authentication. The returned object should be retained for use in the
next steps.

The client should be redirected to the EveSSOUri.uri

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `scope` | `string`[] | `[]` | an array of strings for the scopes to request access to. |

#### Returns

`Promise`<[`EveSSOUri`](../interfaces/EveSSOUri.md)\>

an EveSSOUri object

#### Defined in

[src/index.ts:186](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L186)

___

### refreshToken

▸ **refreshToken**(`refreshToken`, `scopes?`): `Promise`<[`EveSSOToken`](../interfaces/EveSSOToken.md)\>

Refresh your OAuth token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `refreshToken` | `string` | refresh token to use |
| `scopes?` | `string`[] | array of scopes to refresh for (optional) |

#### Returns

`Promise`<[`EveSSOToken`](../interfaces/EveSSOToken.md)\>

a Promise of a new EveSSOToken

#### Defined in

[src/index.ts:272](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L272)

___

### revokeRefreshToken

▸ **revokeRefreshToken**(`refreshToken`): `Promise`<`void`\>

Revoke refresh token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `refreshToken` | `string` | refresh token that you want to revoke |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/index.ts:304](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L304)

___

### verifyToken

▸ **verifyToken**(`token`): `Promise`<[`EveSSOToken`](../interfaces/EveSSOToken.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`EveSSOToken`](../interfaces/EveSSOToken.md) |

#### Returns

`Promise`<[`EveSSOToken`](../interfaces/EveSSOToken.md)\>

#### Defined in

[src/index.ts:210](https://github.com/ballsten/eve-sso-pkce/blob/9067d91/src/index.ts#L210)
