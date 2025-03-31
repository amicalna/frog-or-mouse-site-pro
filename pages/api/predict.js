export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // pour accepter les grosses images
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { base64 } = req.body;

  if (!base64 || !base64.startsWith("data:image")) {
    return res.status(400).json({ error: "Image invalide ou manquante" });
  }

  try {
    const response = await fetch("https://amicalement-frog-or-mouse.hf.space/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [base64],
      }),
    });

    const result = await response.json();
    console.log("🧠 Réponse Gradio :", result);

    res.status(200).json({
      result: result.data?.[0] || "❌ Réponse invalide",
    });
  } catch (error) {
    console.error("Erreur Hugging Face :", error);
    res.status(500).json({ error: "Erreur Hugging Face", raw: error.message });
  }
}
