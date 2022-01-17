[eve-sso-pkce](../README.md) / [Exports](../modules.md) / EveSSOUri

# Interface: EveSSOUri

A URI object for initiating authentication

## Table of contents

### Properties

- [codeVerifier](EveSSOUri.md#codeverifier)
- [state](EveSSOUri.md#state)
- [uri](EveSSOUri.md#uri)

## Properties

### codeVerifier

• **codeVerifier**: `string`

The generated code verifer. Must be saved for later use.

#### Defined in

[src/index.ts:35](https://github.com/ballsten/eve-sso-pkce/blob/ef6b514/src/index.ts#L35)

___

### state

• **state**: `string`

The generated state string

#### Defined in

[src/index.ts:30](https://github.com/ballsten/eve-sso-pkce/blob/ef6b514/src/index.ts#L30)

___

### uri

• **uri**: `string`

the uri to eve auth that the client must be redirected to

#### Defined in

[src/index.ts:25](https://github.com/ballsten/eve-sso-pkce/blob/ef6b514/src/index.ts#L25)
