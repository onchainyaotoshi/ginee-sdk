import "dotenv/config";
import { GineeClient } from "../../src/index.js";

export function createExampleClient() {
  const accessKey = process.env.GINEE_ACCESS_KEY;
  const secretKey = process.env.GINEE_SECRET_KEY;
  const country = process.env.GINEE_COUNTRY ?? "ID";

  if (!accessKey || !secretKey) {
    throw new Error(
      "Missing env vars: GINEE_ACCESS_KEY, GINEE_SECRET_KEY"
    );
  }

  return new GineeClient({
    accessKey,
    secretKey,
    country,
  });
}

export function getShopId(): string {
  const shopId = process.env.GINEE_SHOP_ID;
  if (!shopId) {
    throw new Error("Missing env var: GINEE_SHOP_ID");
  }
  return shopId;
}
