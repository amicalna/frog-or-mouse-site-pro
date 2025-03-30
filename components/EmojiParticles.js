import { useEffect, useState } from "react";

const EMOJIS = {
  grenouille: "🐸",
  souris: "🐭",
};

export default function EmojiParticles({ type }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!type) return;

    const newParticles = Array.from({ length: 40 }).map(() => ({
      id: Math.random(),
      x: 50,
      y: 50,
      angle: Math.random() * 360,
      distance: 100 + Math.random() * 100,
      size: 1 + Math.random() * 1.2,
      delay: Math.random() * 0.3,
    }));

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [type]);

  const emoji = EMOJIS[type];
  if (!emoji) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <span
            key={p.id}
            className="absolute text-2xl animate-emoji-explode"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px)`,
              animationDelay: `${p.delay}s`,
              fontSize: `${p.size}rem`,
            }}
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}
