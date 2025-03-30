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
    setResult(data.result || "❌ Réponse invalide");
  }

  setLoading(false);
};
