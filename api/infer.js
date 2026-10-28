export default function handler(req, res) {
  try {
    // Set standard x402 payment headers for Base L2 network
    res.setHeader('X-Payment-Required', 'true');
    res.setHeader('X-Payment-Network', 'base');
    res.setHeader('X-Payment-Address', process.env.BASE_WALLET_ADDRESS || '0xYourWalletAddressHere');
    res.setHeader('X-Payment-Amount', '0.002');
    res.setHeader('X-Payment-Currency', 'USDC');

    // Return HTTP 402 Payment Required response cleanly
    return res.status(402).json({
      status: 402,
      message: "Payment Required",
      details: "Send 0.002 USDC on Base L2 network to access this AI inference endpoint.",
      chain: "Base"
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Gateway Error", details: err.toString() });
  }
}
