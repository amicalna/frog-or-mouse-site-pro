import { useState } from "react";
import EmojiParticles from "../components/EmojiParticles";

const API_URL = "/api/predict"; // à changer en prod

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("data", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error("Erreur API :", error);
      setResult("❌ Erreur, réessaie !");
    }

    setLoading(false);
  };

  const getEmojiExplosion = () => {
    if (result.includes("grenouille")) {
      return "🐸".repeat(30);
    } else if (result.includes("souris")) {
      return "🐭".repeat(30);
    }
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black drop-shadow-lg">
          🐸{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-pink-500">
            Frog or Mouse
          </span>{" "}
          🐭
        </h1>

        <div
          className="rounded-3xl overflow-hidden shadow-2xl bg-white p-2 border-4 transition-all duration-300"
          style={{ width: "256px", height: "256px" }}
        >
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "1rem",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm text-center">
              Ajoute une photo 🖼️
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="upload-input"
        />

        <label
          htmlFor="upload-input"
          className="cursor-pointer bg-black text-white py-2 px-5 rounded-full font-semibold text-sm hover:bg-gray-900 transition"
        >
          📸 Choisir une image
        </label>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyse en cours..." : "✨ Devine mon espèce !"}
        </button>

        {result && (
          <div className="mt-6 text-center relative">
            <p className="text-2xl md:text-3xl font-bold text-black mb-4 animate-fade-in">
              {result}
            </p>
            <p className="text-4xl animate-bounce-slow">
              {getEmojiExplosion()}
            </p>

            <EmojiParticles
              type={
                result.includes("grenouille")
                  ? "grenouille"
                  : result.includes("souris")
                  ? "souris"
                  : null
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
