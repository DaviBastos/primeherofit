import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import heroImg from "@/assets/hero-fighter.jpg";
import { Activity, Brain, Target, Trophy, Zap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeroFit AI — Desperte seu potencial com IA" },
      { name: "description", content: "Plano de treino personalizado por IA. Para o seu corpo, sua rotina e seus objetivos." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
            <div className="flex flex-col justify-center animate-fade-up">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse-glow" />
                Treinos gerados por IA · Personalizado para você
              </div>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Desperte seu <span className="gradient-text">potencial</span> com IA
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Receba um plano de treino criado especialmente para seu corpo, rotina e
                objetivos. Vire o herói da sua própria jornada fitness.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/create" className="btn-hero rounded-xl px-6 py-3 text-base font-semibold">
                  Criar Meu Plano
                </Link>
                <Link
                  to="/"
                  hash="how"
                  className="rounded-xl glass px-6 py-3 text-base font-semibold hover:bg-white/5 transition-colors"
                >
                  Ver Demonstração
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-neon" /> 100% personalizado</div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Em segundos</div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-8 rounded-full blur-3xl opacity-60" style={{ background: "var(--gradient-hero)" }} />
              <img
                src={heroImg}
                alt="Herói fitness futurista com aura de energia"
                width={640}
                height={640}
                className="relative w-full max-w-md animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="how" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-20">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">Quatro passos para destravar sua melhor versão.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Activity, title: "1. Seus dados", desc: "Informe idade, peso, altura e experiência." },
              { icon: Target, title: "2. Seus objetivos", desc: "Escolha foco: força, emagrecer, condicionamento." },
              { icon: Brain, title: "3. IA analisa", desc: "Nosso treinador IA monta sua estratégia." },
              { icon: Trophy, title: "4. Receba o plano", desc: "Treino semanal completo, no seu ritmo." },
            ].map((s, i) => (
              <div
                key={s.title}
                className="glass rounded-2xl p-6 transition hover:-translate-y-1 hover:border-primary/40"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl btn-hero">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
            <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-glow)" }} />
            <h2 className="text-3xl font-bold md:text-5xl">Sua missão começa agora</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Cinco minutos respondendo. Uma vida inteira evoluindo.
            </p>
            <Link to="/create" className="btn-hero mt-8 inline-block rounded-xl px-8 py-3 font-semibold">
              Criar Meu Plano Gratuito
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} HeroFit AI · Treine como um herói.
        </footer>
      </main>
    </div>
  );
}
