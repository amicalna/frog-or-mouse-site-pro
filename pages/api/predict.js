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

  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: "Erreur parsing fichier ou fichier manquant" });
    }

    const uploadedFile = files.file[0]; // Correction ici : prendre le premier fichier du tableau
    const formData = new FormData();
    formData.append("image", fs.createReadStream(uploadedFile.filepath), uploadedFile.originalFilename);

    try {
      const response = await fetch("https://amicalement-frog-or-mouse.hf.space/run/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      res.status(200).json({ result });
    } catch (error) {
      console.error("Erreur appel Hugging Face :", error);
      res.status(500).json({ error: "Erreur Hugging Face" });
    }
  });
}
