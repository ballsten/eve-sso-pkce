[eve-sso-pkce](../README.md) / [Exports](../modules.md) / EveSSOAuth

# Class: EveSSOAuth

EveSSOAuth provides an interface for all SSO operations

**`remarks`**

This class should be created using the createSSO function

## Table of contents

### Constructors

- [constructor](EveSSOAuth.md#constructor)

### Methods

- [getAccessToken](EveSSOAuth.md#getaccesstoken)
- [getUri](EveSSOAuth.md#geturi)
- [refreshToken](EveSSOAuth.md#refreshtoken)
- [revokeRefreshToken](EveSSOAuth.md#revokerefreshtoken)

## Constructors

### constructor

• **new EveSSOAuth**(`config`, `fetchParam?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | [`EveSSOPCKEAuthConfig`](../interfaces/EveSSOPCKEAuthConfig.md) | `undefined` |
| `fetchParam` | (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> & (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> | `window.fetch` |

#### Defined in

[src/index.ts:134](https://github.com/ballsten/eve-sso-pkce/blob/64fde31/src/index.ts#L134)

## Methods

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

[src/index.ts:268](https://github.com/ballsten/eve-sso-pkce/blob/64fde31/src/index.ts#L268)

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

[src/index.ts:210](https://github.com/ballsten/eve-sso-pkce/blob/64fde31/src/index.ts#L210)

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

[src/index.ts:302](https://github.com/ballsten/eve-sso-pkce/blob/64fde31/src/index.ts#L302)

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

[src/index.ts:334](https://github.com/ballsten/eve-sso-pkce/blob/64fde31/src/index.ts#L334)
