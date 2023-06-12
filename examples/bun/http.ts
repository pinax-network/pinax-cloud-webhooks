import { Bytes, PublicKey, Signature } from "@wharfkit/session";
import "dotenv/config";

const PORT = process.env.PORT ?? 3000;
const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "EOS6Rqd3nkeTzZjXyrM4Nq9HFcagd73vLCEGg6iYGigdTPV8eSRmp";

console.dir(`Listening on port http://localhost:${PORT}`)
console.log(`Signature validation using ${PUBLIC_KEY}`);

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
    const hex = binary.toString("hex");
    const message = Bytes.from(hex);
    const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

    console.dir({timestamp, hex, signature, isVerified});
    console.dir(body);
    if (!isVerified) {
      return new Response("invalid request signature", { status: 401 });
    }
    return new Response("OK");
  },
};
