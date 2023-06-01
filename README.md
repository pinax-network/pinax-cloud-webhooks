# [Pinax Cloud](https://pinax.network/) ☁️ Webhooks

Add webhooks to your Pinax Cloud project.

## Getting Started

To get started using this service, please follow these steps:

1. Submit PR with project details to `"webhooks.yaml"` in this repo.
2. Once PR is merged, you will start receiving POST requests to your webhook URL.
3. If you need to update your webhook URL, submit a PR with the new URL.
4. If you need to remove your webhook, submit a PR removing your project details.

## POST Message

The POST message will be a JSON object with the following structure:

**headers**

```json
{
  "content-type": "application/json",
  "x-signature-secp256k1": "SIG_K1_Kg7FcN3ZnCUs1ZRH129Ps6yiDSQgkTQhbCAugH7AGKkpQaumLXw5yZ4S7vahcqWt44RBgHrCCmSWfKCih8AZ99aMU68PDs",
  "x-signature-timestamp": 1685624506
}
```

**body**

```json
{
  "id": "W897R4SANcQ8T5v-X00Yn",
  "block_num": "248308667",
  "timestamp": "2023-06-01T13:01:46.500Z",
  "endpoint": "https://wax.firehose.eosnation.io:9001",
  "moduleHash": "14af0133e41609c04405da93daeab01806068241",
  "moduleName": "map_transfers",
  "params": [],
  "cursor": "74OpvM2u8WQlJLYDp3f4TaWwLpcyBF5nVgvtLBdGj4ujoyGQ3s_0B2gnaBmFw__wj0S_T12tit_PRX9588FTuNPrxusyvyc7R30vkd29qLDuLPr7MQ9NJb0xDuOJaovRWTjfYQrzebID6tWyaaCMZURmYsAjfmG1hj1ZpoxTcKQQ7HVmwW_6dJrU0_uWpIATrep0RbLwlSmrB2EvKkxfa8XWZfTOtjslMXU=",
  "message": {
    "items": [
      {
        "trxId": "9d923d7eb12b872cc5e456b8ee3371cc34497499aa5cd3fd48ca375ea048683a",
        "actionOrdinal": 2,
        "contract": "alien.worlds",
        "action": "transfer",
        "symcode": "TLM",
        "from": "m.federation",
        "to": "1im2a.c.wam",
        "quantity": "4.0216 TLM",
        "memo": "ALIEN WORLDS - Mined Trilium",
        "amount": "40216",
        "precision": 4,
        "value": 4.0216
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
const body = request.rawBody;
const timestamp = request.headers["x-signature-timestamp"];
const signature = request.headers["x-signature-secp256k1"];

// validate signature using public key
const publicKey = PublicKey.from("PUB_K1_5F38WK8BDCfiu3EWhb5wwrsrrat86GhVEyXp33NbDTB8DgtG4B");
const hex = Buffer.from(timestamp + body).toString("hex");
const isVerified = Signature.from(signature).verifyMessage(Bytes.from(hex), publicKey);
// => true/false
```