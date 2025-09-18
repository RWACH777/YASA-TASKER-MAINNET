// pages/api/verify.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Verification payload:", req.body);

    // For now just tell Pi Server "ok"
    // Later you can call Pi's API to really check tx
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
