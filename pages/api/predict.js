import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
  runtime: "nodejs",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur parsing fichier :", err);
      return res.status(500).json({ error: "Erreur parsing fichier" });
    }

    const uploadedFile = files.file?.[0] || files.file;
    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ error: "Fichier manquant" });
    }

    // Préparer le formData comme attendu par Gradio
    const formData = new FormData();
    formData.append("data", JSON.stringify([null])); // Gradio attend un champ data (même vide)
    formData.append("files", fs.createReadStream(uploadedFile.filepath)); // L’image ici

    try {
      const response = await fetch("https://amicalement-frog-or-mouse.hf.space/run/predict", {
        method: "POST",
        body: formData,
        headers: formData.getHeaders(),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Réponse non JSON :", text);
        return res.status(500).json({ error: "Réponse Hugging Face non JSON", raw: text });
      }

      console.log("🧪 Réponse HF brute :", result);
      res.status(200).json({ result: result.data?.[0] || "❌ Réponse invalide" });
    } catch (error) {
      console.error("Erreur appel Hugging Face :", error);
      res.status(500).json({ error: "Erreur Hugging Face", detail: error.message });
    }
  });
}
