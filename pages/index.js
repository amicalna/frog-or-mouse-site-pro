import { useState } from "react";

const API_URL = "/api/predict";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("🧪 Résultat reçu :", data);
      setResult(data.result || data.error || "❌ Réponse invalide");
    } catch (error) {
      console.error("Erreur API :", error);
      setResult("❌ Erreur, réessaie !");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Frog or Mouse 🐸🐭</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyse..." : "Devine mon espèce !"}
      </button>
      <p>{result}</p>
    </div>
  );
}
