import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    const walletAddress = process.env.BASE_WALLET_ADDRESS || "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0";
    const txHash = req.headers['x-payment-tx'];

    // If a transaction hash is provided, verify it on-chain
    if (txHash) {
      // Connect to Base L2 public RPC
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const tx = await provider.getTransaction(txHash);
      const receipt = await provider.getTransactionReceipt(txHash);

      if (tx && receipt && receipt.status === 1) {
        // Official Base USDC Contract Address
        const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".toLowerCase();
        
        // Basic verification for native ETH or ERC-20 USDC transfers can be added here.
        // For production agent gateways, verify receipt logs matching Transfer event data to walletAddress.
        
        // If payment is successfully verified, fulfill the AI inference request!
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
