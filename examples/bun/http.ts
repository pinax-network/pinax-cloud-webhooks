import { Bytes, PublicKey, Signature } from "@wharfkit/session";
import "dotenv/config";

const PORT = process.env.PORT ?? 3000;
const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "PUB_K1_5F38WK8BDCfiu3EWhb5wwrsrrat86GhVEyXp33NbDTB8DgtG4B";

console.dir(`Listening on port http://localhost:${PORT}`)

export default {
  port: PORT,
  development: true,
  async fetch(request: Request) {
    // get headers and body from POST request
    const timestamp = request.headers.get("x-signature-timestamp");
    const signature = request.headers.get("x-signature-secp256k1");
    const body = await request.text();

    if (!timestamp) return new Response("missing required timestamp in headers", { status: 400 });
    if (!signature) return new Response("missing required signature in headers", { status: 400 });
    if (!body) return new Response("missing body", { status: 400 });

    // validate signature using public key
    const publicKey = PublicKey.from(PUBLIC_KEY);
    const binary = Buffer.from(timestamp + body);
    const message = Bytes.from(binary.toString("hex"));
    const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

    if (!isVerified) {
      return new Response("invalid request signature", { status: 401 });
    }
    console.dir({timestamp, signature, body: JSON.parse(body)});
    return new Response("OK");
  },
};
