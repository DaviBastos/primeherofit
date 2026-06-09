import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/loading")({
  head: () => ({ meta: [{ title: "Gerando plano · HeroFit AI" }] }),
  component: LoadingPage,
});

const steps = [
  "Analisando seu perfil físico...",
  "Cruzando objetivos com sua rotina...",
  "Selecionando exercícios ideais...",
  "Montando sua missão semanal...",
];

function LoadingPage() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setI((x) => Math.min(x + 1, steps.length - 1)), 700);
    const t = setTimeout(() => navigate({ to: "/plan" }), 3200);
    return () => { clearInterval(interval); clearTimeout(t); };
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-glow)" }} />
      <div className="text-center">
        <div className="relative mx-auto mb-8 grid h-24 w-24 place-items-center">
          <div className="absolute inset-0 animate-pulse-glow rounded-full" style={{ background: "var(--gradient-hero)", filter: "blur(20px)" }} />
          <div className="relative grid h-24 w-24 place-items-center rounded-full btn-hero animate-float">
            <Sparkles className="h-10 w-10" />
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold md:text-4xl">
          Seu treinador IA está <span className="gradient-text">montando sua missão</span>
        </h1>
        <p className="mt-6 min-h-[1.5rem] text-muted-foreground animate-fade-up" key={i}>
          {steps[i]}
        </p>
        <div className="mx-auto mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${((i + 1) / steps.length) * 100}%`, background: "var(--gradient-hero)" }}
          />
        </div>
      </div>
    </div>
  );
}
