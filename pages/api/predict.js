import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
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
      console.error("Fichier manquant ou incorrect", files);
      return res.status(400).json({ error: "Fichier manquant" });
    }

    const formData = new FormData();
    formData.append("image", fs.createReadStream(uploadedFile.filepath), uploadedFile.originalFilename);

    try {
      const response = await fetch("https://amicalement-frog-or-mouse.hf.space/run/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Erreur réponse Hugging Face:", errorDetail);
        return res.status(response.status).json({ error: "Erreur Hugging Face", detail: errorDetail });
      }

      const result = await response.json();
      res.status(200).json({ result });

    } catch (error) {
      console.error("Erreur appel Hugging Face :", error);
      res.status(500).json({ error: "Erreur Hugging Face" });
    }
  });
}
