# `Pinax Cloud` ☁️ Webhooks

Add **webhooks** to your [**Pinax Cloud**](https://pinax.network/) project.

## HTTP Server Examples

- [`Bun`](/examples/bun) - https://bun.sh/
- [`Deno`](/examples/deno) - https://deno.com/runtime
- [`Express`](/examples/express) - https://expressjs.com/

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
x-signature-secp256k1: SIG_K1_K2ZCfPn1moGqykfCeDGZMBf9HouYhk4GPu8VZcZuzMmmJzhmvEUqUUaMFWxuikzNE7Xf3LmZnHoBmyCRqUSu67X6CW4khm
x-signature-timestamp: 1685641824
```

**body**

```json
{
  "id": "-rHS8TH8oI_JLIhwC2HK2",
  "chain": "wax",
  "moduleName": "map_transfers",
  "moduleHash": "14af0133e41609c04405da93daeab01806068241",
  "block_num": 248343302,
  "timestamp": "2023-06-01T17:50:24.000Z",
  "cursor": "KC80RueUeEb-vFhATgzluqWwLpc_DFhrXQjhKRJBh4H2pSGR28-mBmYgO0mDlvv03hK9S1L43YmeEXYt88dR6te4wOsxuSltEiovl43t_bLqfaXyPQkZcr1lXOyGZI7aUT7Tagn_ebIA4t_nb6CNYRAyZMBzfzLgiW1UoYICcKtFuiVmxjSrcsjThv3E8tEUq-pwELWikS-gATN4KRlaOc-AZPSYvDooYyNs",
  "data": {
    "items": [
      {
        "trxId": "5d634c6b38d21ed1fc8ed16c203c51f3b6b700fb68d6f4e576075ca90d5be645",
        "actionOrdinal": 2,
        "contract": "alien.worlds",
        "action": "transfer",
        "symcode": "TLM",
        "from": "m.federation",
        "to": "3tqm2.c.wam",
        "quantity": "0.9047 TLM",
        "memo": "ALIEN WORLDS - Mined Trilium",
        "amount": "9047",
        "precision": 4,
        "value": 0.9047
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