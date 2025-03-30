export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  
    try {
      const buffer = await req.arrayBuffer();
      const blob = new Blob([buffer]);
  
      const formData = new FormData();
      formData.append("data", blob, "image.jpg");
  
      const response = await fetch("https://amicalement-frog-or-mouse.hf.space/run/predict", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      res.status(200).json(result);
    } catch (error) {
      console.error("Erreur proxy :", error);
      res.status(500).json({ error: "Erreur proxy" });
    }
  }
  