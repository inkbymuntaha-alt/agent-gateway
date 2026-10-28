export default async function handler(req, res) {
  try {
    const walletAddress = process.env.BASE_WALLET_ADDRESS || "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0";
    const txHash = req.headers['x-payment-tx'];

    // If a transaction hash is provided, verify it via Base public RPC
    if (txHash) {
      const rpcResponse = await fetch("https://mainnet.base.org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getTransactionReceipt",
          params: [txHash],
          id: 1
        })
      });

      const rpcData = await rpcResponse.json();
      const receipt = rpcData.result;

      if (receipt && receipt.status === "0x1") {
        // Payment verified successfully! Return AI payload
        return res.status(200).json({
          status: 200,
          result: "AI inference payload unlocked successfully!",
          answer: "Hello agent, here is your requested intelligence output..."
        });
      }
    }

    // Otherwise, issue the HTTP 402 Payment Required challenge
    res.setHeader('X-Payment-Required', 'true');
    res.setHeader('X-Payment-Network', 'base');
    res.setHeader('X-Payment-Address', walletAddress);
    res.setHeader('X-Payment-Amount', '0.002');
    res.setHeader('X-Payment-Currency', 'USDC');

    return res.status(402).json({
      status: 402,
      message: "Payment Required",
      details: "Send 0.002 USDC on Base L2 network to access this AI inference endpoint.",
      pay_to: walletAddress,
      amount: "0.002",
      currency: "USDC",
      chain: "Base"
    });

  } catch (err) {
    return res.status(500).json({ error: "Internal Gateway Error", details: err.toString() });
  }
}
