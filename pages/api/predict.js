import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // important pour gérer le fichier
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.error("Erreur formidable :", err);
      return res.status(500).json({ error: "Erreur parsing fichier" });
    }

    const file = files.data;

    const formData = new FormData();
    formData.append("data", fs.createReadStream(file.filepath), file.originalFilename);

    try {
      const response = await fetch("https://amicalement-frog-or-mouse.hf.space/run/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      console.error("Erreur fetch Hugging Face :", error);
      res.status(500).json({ error: "Erreur appel Hugging Face" });
    }
  });
}
