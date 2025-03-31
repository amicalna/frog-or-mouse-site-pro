const handleUpload = async () => {
  if (!file) return;
  setLoading(true);
  setResult("");

  const reader = new FileReader();

  reader.onloadend = async () => {
    const base64 = reader.result;

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64 }),
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

  reader.readAsDataURL(file); // Convertit l’image en base64 automatiquement
};
