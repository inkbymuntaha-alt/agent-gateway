export default async function handler(req, res) {
  try {
    // Read wallet from environment variable, or fall back to your hardcoded address string
    const walletAddress = process.env.BASE_WALLET_ADDRESS || "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0";

    // Set standard HTTP 402 payment headers for Base L2 network
    res.setHeader('X-Payment-Required', 'true');
    res.setHeader('X-Payment-Network', 'base');
    res.setHeader('X-Payment-Address', walletAddress);
    res.setHeader('X-Payment-Amount', '0.002');
    res.setHeader('X-Payment-Currency', 'USDC');

    // Return HTTP 402 Payment Required response with wallet details
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
