# ginee-sdk

implementation SDK of https://doc.ginee.com/index.html 

# INSTALL

```
npm install @yaotoshi/ginee-sdk
```

# HOW TO USE
```
(async () => {
  const { GineeClient } = await import("@yaotoshi/ginee-sdk");

  const client = new GineeClient({ accessKey: "YOUR_ACCESS_KEY", secretKey: "YOUR_SECRET_KEY" });
  const res = await client.orders.listAllByDateWIB("2025-10-01");
  console.log("TOTAL:", res.length);
})();
```