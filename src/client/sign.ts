import crypto from "node:crypto";

export function buildAuthorization(opts: {
  accessKey: string;
  secretKey: string;
  method: string;      // "POST" | "GET" ...
  requestUri: string;  // "/openapi/order/v2/list-order"
}) {
  const method = opts.method.toUpperCase();
  const signStr = `${method}$${opts.requestUri}$`; // sesuai docs :contentReference[oaicite:3]{index=3}

  const signature = crypto
    .createHmac("sha256", opts.secretKey)
    .update(signStr, "utf8")
    .digest("base64");

  return `${opts.accessKey}:${signature}`; // Authorization format :contentReference[oaicite:4]{index=4}
}
