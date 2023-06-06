import { Bytes, PublicKey, Signature } from "@wharfkit/session";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { encode } from "https://deno.land/std@0.190.0/encoding/hex.ts";
import "https://deno.land/std@0.190.0/dotenv/load.ts";

const PORT = Deno.env.get("PORT") ?? 3000;
const PUBLIC_KEY = Deno.env.get("PUBLIC_KEY") ?? "PUB_K1_5F38WK8BDCfiu3EWhb5wwrsrrat86GhVEyXp33NbDTB8DgtG4B";

const handler = async (request: Request) => {
  // get headers and body from POST request
  const timestamp = request.headers.get("x-signature-timestamp");
  const signature = request.headers.get("x-signature-secp256k1");
  const body = await request.text();
  // console.log(body);

  if (!timestamp) return new Response("missing required timestamp in headers", { status: 400 });
  if (!signature) return new Response("missing required signature in headers", { status: 400 });
  if (!body) return new Response("missing body", { status: 400 });

  // validate signature using public key
  const publicKey = PublicKey.from(PUBLIC_KEY);
  const binary = new TextEncoder().encode(timestamp + body);
  const message = Bytes.from(new TextDecoder().decode(encode(binary)));
  const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

  if (!isVerified) {
    return new Response("invalid request signature", { status: 401 });
  }
  console.dir({timestamp, signature, body: JSON.parse(body)});
  return new Response("OK");
};

await serve(handler, { port: PORT });
