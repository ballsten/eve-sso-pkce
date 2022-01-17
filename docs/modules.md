[eve-sso-pkce](README.md) / Exports

# eve-sso-pkce

## Table of contents

### Classes

- [EveSSOAuth](classes/EveSSOAuth.md)

### Interfaces

- [EveSSOPCKEAuthConfig](interfaces/EveSSOPCKEAuthConfig.md)
- [EveSSOPayload](interfaces/EveSSOPayload.md)
- [EveSSOToken](interfaces/EveSSOToken.md)
- [EveSSOUri](interfaces/EveSSOUri.md)

### Functions

- [createSSO](modules.md#createsso)

## Functions

### createSSO

▸ **createSSO**(`config`, `fetch?`): [`EveSSOAuth`](classes/EveSSOAuth.md)

Returns an new instance of EveSSOAuth

**`remarks`**

This function is the main export of the package. It is used to instatiate the EveSSOAuth class.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `config` | [`EveSSOPCKEAuthConfig`](interfaces/EveSSOPCKEAuthConfig.md) | `undefined` | A config object |
| `fetch` | (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> & (`input`: `RequestInfo`, `init?`: `RequestInit`) => `Promise`<`Response`\> | `window.fetch` | Dependency injection for fetch, do not use unless you know what you are doing |

#### Returns

[`EveSSOAuth`](classes/EveSSOAuth.md)

A EveSSOAuth object

#### Defined in

[src/index.ts:102](https://github.com/ballsten/eve-sso-pkce/blob/64fde31/src/index.ts#L102)
