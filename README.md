# `Pinax Cloud` ☁️ Webhooks

Add **webhooks** to your [**Pinax Cloud**](https://pinax.network/) project.

## HTTP Server examples

- [`Bun`](/examples/bun) - https://bun.sh/
- [`Deno`](/examples/deno) - https://deno.com/runtime
- [`Express`](/examples/express) - https://expressjs.com/
- [`node:http`](/examples/node:http) - https://nodejs.org/api/http.html
- [POST request](/examples/post.http)

## Getting Started

To get started using this service, please follow these steps:

1. Submit PR with project details to [`webhooks.yaml`](webhooks.yml) in this repo.
2. Once PR is merged, you will start receiving POST requests to your webhook URL.
3. If you need to update your webhook URL, submit a PR with the new URL.
4. If you need to remove your webhook, submit a PR removing your project details.

## [`webhooks.yaml`](webhooks.yml)
```yaml
- url: http://localhost:3000
  chain: wax
  substreams: eosio.token
  module: map_transfers
  param: symcode=WAX
```

| Field         | Description |
| ------------- | ----------- |
| `url`         | URL to receive POST requests. |
| `chain`       | Receive data from blockchain. |
| `substreams`  | Substreams data source. |
| `module`      | Substreams module. |
| `param`       | Any additional filters to apply. |

### Chains available
- `wax`
- `eos`
- `polygon`

### Substreams/module available
- [`eosio.token`](https://github.com/pinax-network/substreams/tree/develop/eosio.token)
  - `map_transfers`
  - `map_accounts`
  - `map_stat`

## POST Message

The POST message will be a JSON object with the following structure:

**headers**

```http
POST http://localhost:3000 HTTP/1.1
content-type: application/json
x-signature-ed25519: 8bfa890aef1bccc753c9cad540844fb1082c610d505a23ecdfabd0bed05cfa429471f0b20f49c3e6125677ab1eedc625fb4f7bfcc8eeff125312a176ba41460b
x-signature-timestamp: 1686802918
```

**body**

```json
{
  "cursor": "gBCLb0z81lU8vbvZVzJkEaWwLpc_DFhqVQ3jLxVJgYH2pSTFicymUzd9bx2GlKH51RboGgmo19eZRX588ZED7YW8y7FhuSM6EHh4wNzo87Dne6KjPQlIIOhjC-iJMNncUT7SYgz9f7UI5N_nb6XZMxMyMZEuK2blizdZqoZXIfAVsHthkjz6cJ6Bga_A-YtEq-AnEuf1xn6lDzF1Lx4LOc_RNqGe6z4nN3Rq",
  "clock": {
    "timestamp": "2023-06-15T04:21:58.000Z",
    "number": 250665484,
    "id": "0ef0da0cf870f489833ac498da073acadf895d22f3dce68483aa43cac1d27b17"
  },
  "manifest": {
    "chain": "wax",
    "moduleName": "map_transfers",
    "moduleHash": "6aa24e6aa34db4a4faf55c69c6f612aeb06053c2"
  },
  "data": {
    "items": [
      {
        "trxId": "dd93c64db8ff91cfac74e731fd518548aa831be3d833e6a1fefeac69d2ddd138",
        "actionOrdinal": 2,
        "contract": "eosio.token",
        "action": "transfer",
        "symcode": "WAX",
        "from": "banxawallet1",
        "to": "atomicmarket",
        "quantity": "1340.00000000 WAX",
        "memo": "deposit",
        "precision": 8,
        "amount": "134000000000",
        "value": 1340
      },
      {
        "trxId": "dd93c64db8ff91cfac74e731fd518548aa831be3d833e6a1fefeac69d2ddd138",
        "actionOrdinal": 7,
        "contract": "eosio.token",
        "action": "transfer",
        "symcode": "WAX",
        "from": "atomicmarket",
        "to": "jft4m.c.wam",
        "quantity": "1206.00000000 WAX",
        "memo": "AtomicMarket Sale Payout - ID #129675349",
        "precision": 8,
        "amount": "120600000000",
        "value": 1206
      }
    ]
  }
}
```

## Signing Request libraries

### Typescript
- [Greymass - `eosio-signing-request`](https://github.com/greymass/eosio-signing-request)

## C#
- [Scatter - `eos-sharp`](https://github.com/GetScatter/eos-sharp)
- [Liquiid - `EosioSigningRequestSharp`](https://github.com/liquiidio/EosioSigningRequestSharp)

### Go
- [EOS Canada & EOS Nation - `eos-go`](https://github.com/EOS-Nation/eos-go)

## Validate R1 signature

```typescript
import nacl from "tweetnacl";

// ...HTTP server

// get headers and body from POST request
const rawBody = await request.text();
const timestamp = request.headers.get("x-signature-timestamp");
const signature = request.headers.get("x-signature-ed25519");

// validate signature using public key
const isVerified = nacl.sign.detached.verify(
  Buffer.from(timestamp + body),
  Buffer.from(signature, 'hex'),
  Buffer.from(PUBLIC_KEY, 'hex')
);

if (!isVerified) {
  return new Response("invalid request signature", { status: 401 });
}
```

## Docker