export default async function handler(req, res) {
  // Allow both GET (for easy browser testing) and POST (for AI agents)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const recipientWallet = process.env.BASE_WALLET_ADDRESS || "0xYourBaseWalletAddressHere";

  // Optional: Send a Telegram notification on hit
  if (telegramToken && chatId) {
    try {
      const message = encodeURIComponent(`🚨 Gateway Hit!\nMethod: ${req.method}\nIP: ${req.headers['x-forwarded-for'] || 'Unknown'}`);
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=${message}`);
    } catch (err) {
      console.error("Telegram alert failed:", err);
    }
  }

  // Set standard x402 payment headers for Base L2 network
  res.setHeader('X-Payment-Required', 'true');
  res.setHeader('X-Payment-Network', 'base');
  res.setHeader('X-Payment-Address', recipientWallet);
  res.setHeader('X-Payment-Amount', '0.002');
  res.setHeader('X-Payment-Currency', 'USDC');

  // Return HTTP 402 Payment Required status with JSON payload
  return res.status(402).json({
    status: 402,
    message: "Payment Required",
    details: "Send 0.002 USDC on Base L2 network to access this AI inference endpoint.",
    pay_to: recipientWallet,
    amount: "0.002",
    currency: "USDC",
    chain: "Base"
  });
}
export const config = { runtime: 'edge' };

export async function POST(request) {
  const paymentSignature = request.headers.get('x-payment-signature');
  
  // REPLACE WITH YOUR ACTUAL BASE WALLET ADDRESS FROM PHASE A
  const MY_WALLET = "0x960E510E4E1dA4B13CE3b601202d4680AFcf02E0";

  if (!paymentSignature) {
    const paymentRequirements = {
      x402Version: 2,
      error: "Payment Required",
      accepts: [
        {
          scheme: "exact",
          price: "$0.002",
          currency: "USDC",
          network: "eip155:8453", // Base Mainnet
          payTo: MY_WALLET
        }
      ]
    };

    return new Response(JSON.stringify(paymentRequirements), {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'PAYMENT-REQUIRED': Buffer.from(JSON.stringify(paymentRequirements)).toString('base64')
      }
    });
  }

  // Payment verified: Respond to calling agent
  return new Response(JSON.stringify({
    status: "success",
    result: "Execution completed successfully.",
    settled_via: "x402-base-network"
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
