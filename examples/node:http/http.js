import { Bytes, PublicKey, Signature } from "@wharfkit/session";
import * as http from "node:http";
import "dotenv/config";

const PORT = process.env.PORT ?? 3000;
const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "PUB_K1_6Rqd3nkeTzZjXyrM4Nq9HFcagd73vLCEGg6iYGigdTPV7ymQKT";
const server = http.createServer();

function rawBody(request) {
  return new Promise<string>((resolve, reject) => {
      let chunks = [];
      request.on('data', (chunk) => {
          chunks.push(chunk);
      }).on('end', () => {
          resolve(Buffer.concat(chunks).toString());
      });
  });
}

// Create a local server to serve Prometheus gauges
server.on("request", async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  // get headers and body from POST request
  const timestamp = String(req.headers["x-signature-timestamp"]);
  const signature = String(req.headers["x-signature-secp256k1"]);
  const body = await rawBody(req);

  if (!timestamp) return res.writeHead(400).end("missing required timestamp in headers");
  if (!signature) return res.writeHead(400).end("missing required signature in headers");
  if (!body) return res.writeHead(400).end("missing body");

  // validate signature using public key
  const publicKey = PublicKey.from(PUBLIC_KEY);
  const binary = Buffer.from(timestamp + body);
  const message = Bytes.from(binary.toString("hex"));
  const isVerified = Signature.from(signature).verifyMessage(message, publicKey);

  if (!isVerified) {
    return res.writeHead(401).end("invalid request signature");
  }
  console.dir({timestamp, signature, body: JSON.parse(body)});
  return res.end("OK");
});

server.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
