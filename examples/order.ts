import { createExampleClient } from "./lib/ginee.js";
const client = createExampleClient();

async function main() {
  // const res = await client.orders.listAllByDateWIB("2025-10-01");

  // console.log("TOTAL:", res.length);
  
  // const res2 = await client.orders.getDetailsByOrderIds(res.slice(0, 3).flatMap(x=>x.orderId));
  // console.log(res2);

  const res3 = await client.orders.getDetailsByOrderIds(["SO695010B146E0FB000142B939", "SO695010EDC9E77C0001494BEF"]);
  console.log(res3);
}

main().catch(console.error);
