import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

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

    // Préparer FormData pour Gradio
    const formData = new FormData();
    formData.append("data", JSON.stringify([null]));  // Champ 'data' attendu
    formData.append("file", fs.createReadStream(uploadedFile.filepath), {
      filename: uploadedFile.originalFilename,
      contentType: uploadedFile.mimetype,
    });

    try {
      // Envoi via axios avec les headers appropriés
      const response = await axios.post(
        "https://amicalement-frog-or-mouse.hf.space/api/predict",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync(),  // Définit correctement la taille
          },
        }
      );

      res.status(200).json({ result: response.data.data?.[0] || "❌ Réponse invalide" });
    } catch (error) {
      console.error("Erreur Hugging Face :", error);
      res.status(500).json({ error: "Erreur Hugging Face", raw: error.response?.data || error.message });
    }
  });
}
