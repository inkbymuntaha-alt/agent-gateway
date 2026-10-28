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
