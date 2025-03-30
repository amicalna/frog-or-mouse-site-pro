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
  console.log("👉 Requête API reçue :", req.method);

  if (req.method !== "POST") {
    console.log("❌ Mauvaise méthode :", req.method);
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Erreur parsing fichier :", err);
      return res.status(500).json({ error: "Erreur parsing fichier" });
    }

    console.log("📦 Fichier reçu :", files);

    const uploadedFile = files.file;
    const filePath = Array.isArray(uploadedFile)
      ? uploadedFile[0].filepath
      : uploadedFile?.filepath;

    if (!filePath) {
      return res.status(400).json({ error: "Fichier introuvable ou invalide" });
    }

    const formData = new FormData();
    formData.append(
      "data",
      fs.createReadStream(filePath),
      uploadedFile.originalFilename || "image.jpg"
    );

    try {
      const response = await fetch("https://amicalement-frog-or-mouse.hf.space/run/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      console.error("🔥 Erreur appel Hugging Face :", error);
      res.status(500).json({ error: "Erreur Hugging Face" });
    }
  });
}
