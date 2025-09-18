export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {
      return res.status(400).json({ error: "Missing paymentId or txid" });
    }

    // Call Pi backend API to complete the payment
    const response = await fetch("https://api.minepi.com/v2/payments/" + paymentId + "/complete", {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.PI_API_KEY}`,  // same API key in Vercel
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("Complete error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}