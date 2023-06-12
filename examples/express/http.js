import { Bytes, PublicKey, Signature } from "@wharfkit/session";
import express from 'express';
import "dotenv/config";

const PORT = process.env.PORT ?? 3000;
const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "PUB_K1_6Rqd3nkeTzZjXyrM4Nq9HFcagd73vLCEGg6iYGigdTPV7ymQKT";
const app = express()

app.use(express.text({ type: 'application/json'}));

app.use(async (req, res) => {
  // get headers and body from POST request
  const timestamp = req.headers["x-signature-timestamp"];
  const signature = req.headers["x-signature-secp256k1"];
  const body = req.body;

  if (!timestamp) return res.send("missing required timestamp in headers").status(400);
  if (!signature) return res.send("missing required signature in headers").status(400);
  if (!body) return res.send("missing body").status(400);

  // validate signature using public key
  const publicKey = PublicKey.from(PUBLIC_KEY);
  const hex = Buffer.from(timestamp + body).toString("hex");
  const message = Bytes.from(hex);
  const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

  console.dir({timestamp, hex, signature, isVerified});
  console.dir(body);
  if (!isVerified) {
      return res.send("invalid request signature").status(401);
  }
  return res.send('OK').status(200);
})

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
  console.log(`Signature validation using ${PUBLIC_KEY}`);
})
