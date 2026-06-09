import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { loadPlan, savePlan, type Plan } from "@/lib/plan";
import { Flame, CheckCircle2, Circle, Award, TrendingUp, Target } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · HeroFit AI" }] }),
  component: Dashboard,
});

const COMPLETED_KEY = "herofit:completed";

function Dashboard() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const p = loadPlan();
    if (!p) { navigate({ to: "/create" }); return; }
    setPlan(p);
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch { /* noop */ }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }, [completed]);

  const trainingDays = useMemo(
    () => (plan ? plan.week.filter((d) => !d.rest) : []),
    [plan]
  );
  const doneCount = trainingDays.filter((d) => completed[d.day]).length;
  const progress = trainingDays.length ? Math.round((doneCount / trainingDays.length) * 100) : 0;
  const xp = doneCount * 120;

  // Sync mission progress
  useEffect(() => {
    if (!plan) return;
    const updated: Plan = {
      ...plan,
      missions: plan.missions.map((m, i) => ({
        ...m,
        progress: Math.min(100, progress + i * 5),
      })),
    };
    savePlan(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneCount]);

  if (!plan) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Dashboard do <span className="gradient-text">herói</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Acompanhe sua evolução semanal e desbloqueie missões.</p>
        </div>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Nível</div>
                <div className="mt-1 font-display text-2xl font-bold">{plan.level}</div>
              </div>
              <Award className="h-8 w-8 text-neon" />
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full" style={{ width: `${Math.min(100, xp % 600 / 6)}%`, background: "var(--gradient-hero)" }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{xp} XP acumulados</div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Progresso semanal</div>
                <div className="mt-1 font-display text-2xl font-bold">{progress}%</div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full transition-all" style={{ width: `${progress}%`, background: "var(--gradient-hero)" }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{doneCount} de {trainingDays.length} treinos</div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Meta principal</div>
                <div className="mt-1 font-display text-lg font-semibold leading-tight">{plan.goalLabel}</div>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Streak</div>
                <div className="mt-1 font-display text-2xl font-bold">{doneCount} 🔥</div>
              </div>
              <Flame className="h-8 w-8 text-neon" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Mantenha o ritmo!</div>
          </Card>
        </section>

        {/* Week tracking */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-bold">Sua semana</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {plan.week.map((d) => (
              <button
                key={d.day}
                disabled={d.rest}
                onClick={() => setCompleted((c) => ({ ...c, [d.day]: !c[d.day] }))}
                className={`glass rounded-2xl p-5 text-left transition ${
                  d.rest ? "opacity-50 cursor-default" : "hover:border-primary/40"
                } ${completed[d.day] ? "border-primary glow-primary" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{d.day}</div>
                    <div className="font-display text-lg font-semibold">{d.focus}</div>
                  </div>
                  {d.rest ? null : completed[d.day] ? (
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  ) : (
                    <Circle className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>
                {!d.rest && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {d.exercises.length} exercícios · {d.estimatedMinutes} min
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Missions */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-bold">Missões em andamento</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {plan.missions.map((m, i) => (
              <Card key={m.title}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg btn-hero text-xs font-bold">{i + 1}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Missão</span>
                </div>
                <div className="font-display font-semibold">{m.title.replace(/^Missão \d+: /, "")}</div>
                <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full transition-all" style={{ width: `${Math.min(100, progress + i * 5)}%`, background: "var(--gradient-hero)" }} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{Math.min(100, progress + i * 5)}% concluída</div>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/plan" className="btn-hero rounded-xl px-6 py-3 font-semibold">Ver plano completo</Link>
          <Link to="/create" className="glass rounded-xl px-6 py-3 font-semibold hover:bg-white/5">Refazer plano</Link>
        </div>
      </main>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="glass rounded-2xl p-5">{children}</div>;
}
