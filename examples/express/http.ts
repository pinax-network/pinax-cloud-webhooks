import { Bytes, PublicKey, Signature } from "@wharfkit/session";
import express from 'express';

const port = 3000;
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
  const publicKey = PublicKey.from("PUB_K1_5F38WK8BDCfiu3EWhb5wwrsrrat86GhVEyXp33NbDTB8DgtG4B");
  const message = Bytes.from(Buffer.from(timestamp + body).toString("hex"));
  const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

  if (!isVerified) {
      return res.send("invalid request signature").status(401);
  }
  console.dir({timestamp, signature, body: JSON.parse(body)});
  return res.send('OK').status(200);
})

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
})
