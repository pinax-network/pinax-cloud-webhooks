import { Bytes, PublicKey, Signature } from "@wharfkit/session";

export default {
  port: 3000,
  development: true,
  async fetch(request) {
    // get headers and body from POST request
    const timestamp = request.headers.get("x-signature-timestamp");
    const signature = request.headers.get("x-signature-secp256k1");
    const body = await request.text();

    if (!timestamp) return new Response("missing required timestamp in headers", { status: 400 });
    if (!signature) return new Response("missing required signature in headers", { status: 400 });
    if (!body) return new Response("missing body", { status: 400 });

    // validate signature using public key
    const publicKey = PublicKey.from("PUB_K1_5F38WK8BDCfiu3EWhb5wwrsrrat86GhVEyXp33NbDTB8DgtG4B");
    const hex = Buffer.from(timestamp + body).toString("hex");
    const isVerified = Signature.from(signature).verifyMessage(Bytes.from(hex), publicKey);
    if (!isVerified) {
      return new Response("invalid request signature", { status: 401 });
    }
    console.dir({timestamp, signature});
    console.dir(JSON.stringify(JSON.parse(body), null, 2));
    return new Response("OK");
  },
};
