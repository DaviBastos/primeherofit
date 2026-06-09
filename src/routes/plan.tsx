import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { loadPlan, type Plan } from "@/lib/plan";
import { Moon, Dumbbell, Target, Trophy, LayoutDashboard, Sparkles } from "lucide-react";

export const Route = createFileRoute("/plan")({
  head: () => ({ meta: [{ title: "Seu plano · HeroFit AI" }] }),
  component: PlanPage,
});

function PlanPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const p = loadPlan();
    if (!p) navigate({ to: "/create" });
    else setPlan(p);
  }, [navigate]);

  if (!plan) return null;
  const { profile } = plan;
  const bmi = (profile.weight / Math.pow(profile.height, 2)).toFixed(1);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-neon" /> Plano gerado por IA
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Olá, <span className="gradient-text">{profile.name}</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Sua jornada começa agora. Nível atribuído: <strong className="text-foreground">{plan.level}</strong>.</p>
        </div>

        {/* Resumo do perfil */}
        <section className="mb-10 grid gap-4 md:grid-cols-4">
          <Stat icon={Target} label="Objetivo principal" value={plan.goalLabel} />
          <Stat icon={Dumbbell} label="Local" value={cap(profile.place)} />
          <Stat icon={Trophy} label="IMC" value={bmi} />
          <Stat icon={LayoutDashboard} label="Frequência" value={`${profile.daysPerWeek}x / semana`} />
        </section>

        {/* Missões */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold">Suas missões</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {plan.missions.map((m, i) => (
              <div key={m.title} className="glass rounded-2xl p-5 transition hover:-translate-y-1">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg btn-hero text-xs font-bold">{i + 1}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Missão</span>
                </div>
                <h3 className="font-display font-semibold">{m.title.replace(/^Missão \d+: /, "")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Plano semanal */}
        <section className="mb-12">
          <h2 className="mb-4 font-display text-2xl font-bold">Plano semanal</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {plan.week.map((d) => (
              <div key={d.day} className="glass rounded-2xl p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{d.day}</div>
                    <div className="font-display text-lg font-semibold">{d.focus}</div>
                  </div>
                  {d.rest ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                      <Moon className="h-3 w-3" /> Descanso
                    </span>
                  ) : (
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
                      {d.estimatedMinutes} min
                    </span>
                  )}
                </div>
                {!d.rest && (
                  <ul className="divide-y divide-white/5">
                    {d.exercises.map((e) => (
                      <li key={e.name} className="flex items-center justify-between py-2.5 text-sm">
                        <span>{e.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {e.sets} × {e.reps} · {e.rest}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="btn-hero rounded-xl px-6 py-3 font-semibold">
            Ir para o dashboard
          </Link>
          <Link to="/create" className="glass rounded-xl px-6 py-3 font-semibold hover:bg-white/5">
            Refazer plano
          </Link>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="font-display text-xl font-semibold">{value}</div>
    </div>
  );
}

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).replace("-", " "); }
