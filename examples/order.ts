import { createExampleClient } from "./lib/ginee.js";
const client = createExampleClient();

async function main() {
  const res = await client.orders.listAllByDateWIB("2025-10-01");

  console.log("TOTAL:", res.length);
  
  const res2 = await client.orders.getDetailsByOrderIds(res.slice(0, 3).flatMap(x=>x.orderId));
  console.log(res2);
}

main().catch(console.error);
