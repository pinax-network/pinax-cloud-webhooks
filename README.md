# `Pinax Cloud` ☁️ Webhooks

Add **webhooks** to your [**Pinax Cloud**](https://pinax.network/) project.

## HTTP Server examples

- [`Bun`](/examples/bun) - https://bun.sh/
- [`Deno`](/examples/deno) - https://deno.com/runtime
- [`Express`](/examples/express) - https://expressjs.com/
- [`node:http`](/examples/node:http) - https://nodejs.org/api/http.html

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
x-signature-secp256k1: SIG_K1_Ke6QVix3nkobMBmeWkBFq9Dhee1wQEvaCwtDzqmrZ2u4cRjjA7R3kxioxZJVExL2J14RYxpzeFP4mkohUwQsBSmAPKz5mG
x-signature-timestamp: 1685740240
```

**body**

```json
{
  "id": "DgHKHEVqKVEYDbPe9YLXY",
  "cursor": "zabwrIYYom395LNlwBky4aWwLpcyBF5nUA_lKxJDj4ujpHLDj8iiVGJ0bE7Uwvz1iBLoQgyrj4vIEC9z9JRWvoO_kek26CQ_QC4lwYHvrrTvKfb1aFsTJO5qW77bM9DRWTjfZwnyfbgJ6tWybvPfNks1Z5QiKmO7jG1ZooMCePBDv3sxwWmvcMnV1fvE8NRI_-IiEbKpnX-rBWZ-KE9cNJnQZ_PKvTx2ZHY=",
  "clock": {
    "timestamp": "2023-06-02T21:10:40.000Z",
    "number": 248540132,
    "id": "0ed06be4d314c4be5e739f7ad54a86d62bebab5576e9b81e00a57aa8ee84dea8"
  },
  "manifest": {
    "chain": "wax",
    "moduleName": "map_transfers",
    "moduleHash": "14af0133e41609c04405da93daeab01806068241"
  },
  "data": {
    "items": [
      {
        "trxId": "582d1689db6313bb04550ad359c2039290714256a97b5ac15e6d764f0d870f74",
        "actionOrdinal": 2,
        "contract": "waxbettokens",
        "action": "transfer",
        "symcode": "ETH",
        "from": "earnbetaccts",
        "to": "waxbetdice11",
        "quantity": "0.00090000 ETH",
        "memo": "o50--,154",
        "amount": "90000",
        "precision": 8,
        "value": 0.0009
      }, {
        "trxId": "ab515ecb7e0f2f36e70a6cb927935b0a511f507bd5eb941a75bd93f8facbf78e",
        "actionOrdinal": 1,
        "contract": "alien.worlds",
        "action": "transfer",
        "symcode": "TLM",
        "from": "alienhelpers",
        "to": "wuitk.wam",
        "quantity": "0.0101 TLM",
        "memo": "AlienHelpers 👾",
        "amount": "101",
        "precision": 4,
        "value": 0.0101
      }
    ]
  }
}
```

## Validate R1 signature

```typescript
import { Bytes, PublicKey, Signature } from "@wharfkit/session";

// ...HTTP server

// get headers and body from POST request
const rawBody = await request.text();
const timestamp = request.headers.get("x-signature-timestamp");
const signature = request.headers.get("x-signature-secp256k1");

// validate signature using public key
const publicKey = PublicKey.from("PUB_K1_5F38WK8BDCfiu3EWhb5wwrsrrat86GhVEyXp33NbDTB8DgtG4B");
const message = Bytes.from(Buffer.from(timestamp + rawBody).toString("hex"));
const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

if (!isVerified) {
  return new Response("invalid request signature", { status: 401 });
}
```