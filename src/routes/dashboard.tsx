import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { loadPlan, savePlan, type Plan } from "@/lib/plan";
import {
  Flame, CheckCircle2, Circle, Award, TrendingUp, Target,
  Trophy, Zap, Calendar, Medal, Star, Lock, Sunrise,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · HeroFit AI" }] }),
  component: Dashboard,
});

const COMPLETED_KEY = "herofit:completed";
const ACTIVE_DAYS_KEY = "herofit:activeDays";

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) =>
  Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

function computeStreaks(days: string[]) {
  if (days.length === 0) return { current: 0, longest: 0 };
  const sorted = [...new Set(days)].sort();
  let longest = 1, run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (daysBetween(sorted[i - 1], sorted[i]) === 1) run++;
    else run = 1;
    if (run > longest) longest = run;
  }
  // current streak ending today or yesterday
  let current = 0;
  const today = todayISO();
  const last = sorted[sorted.length - 1];
  const gap = daysBetween(last, today);
  if (gap <= 1) {
    current = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      if (daysBetween(sorted[i - 1], sorted[i]) === 1) current++;
      else break;
    }
  }
  return { current, longest };
}

function Dashboard() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [activeDays, setActiveDays] = useState<string[]>([]);

  useEffect(() => {
    const p = loadPlan();
    if (!p) { navigate({ to: "/create" }); return; }
    setPlan(p);
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      if (raw) setCompleted(JSON.parse(raw));
      const rawA = localStorage.getItem(ACTIVE_DAYS_KEY);
      if (rawA) setActiveDays(JSON.parse(rawA));
    } catch { /* noop */ }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }, [completed]);
  useEffect(() => {
    localStorage.setItem(ACTIVE_DAYS_KEY, JSON.stringify(activeDays));
  }, [activeDays]);

  const trainingDays = useMemo(
    () => (plan ? plan.week.filter((d) => !d.rest) : []),
    [plan]
  );
  const doneCount = trainingDays.filter((d) => completed[d.day]).length;
  const progress = trainingDays.length ? Math.round((doneCount / trainingDays.length) * 100) : 0;
  const totalSessions = activeDays.length;
  const xp = totalSessions * 120 + doneCount * 30;

  const { current: streak, longest: longestStreak } = useMemo(
    () => computeStreaks(activeDays),
    [activeDays]
  );

  const today = todayISO();
  const trainedToday = activeDays.includes(today);

  const toggleToday = () => {
    setActiveDays((prev) =>
      prev.includes(today) ? prev.filter((d) => d !== today) : [...prev, today]
    );
  };

  // Daily progression goal: at least 1 training per day, target = profile.daysPerWeek per week
  const last7 = useMemo(() => {
    const arr: { date: string; done: boolean; label: string }[] = [];
    const wk = ["D", "S", "T", "Q", "Q", "S", "S"];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const iso = dt.toISOString().slice(0, 10);
      arr.push({ date: iso, done: activeDays.includes(iso), label: wk[dt.getDay()] });
    }
    return arr;
  }, [activeDays]);
  const weekActive = last7.filter((d) => d.done).length;
  const weekTarget = plan?.profile.daysPerWeek ?? 4;

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

  const achievements = useMemo(() => [
    { id: "first", title: "Primeiro passo", desc: "Conclua seu primeiro treino", icon: Sunrise, unlocked: totalSessions >= 1 },
    { id: "streak3", title: "Em chamas", desc: "3 dias seguidos treinando", icon: Flame, unlocked: longestStreak >= 3 },
    { id: "streak7", title: "Semana de aço", desc: "7 dias consecutivos", icon: Zap, unlocked: longestStreak >= 7 },
    { id: "streak14", title: "Imparável", desc: "14 dias consecutivos", icon: Trophy, unlocked: longestStreak >= 14 },
    { id: "ten", title: "Veterano", desc: "10 treinos completos", icon: Medal, unlocked: totalSessions >= 10 },
    { id: "thirty", title: "Lendário", desc: "30 treinos completos", icon: Star, unlocked: totalSessions >= 30 },
    { id: "fullweek", title: "Semana cheia", desc: "Bata a meta semanal", icon: Calendar, unlocked: weekActive >= weekTarget },
    { id: "perfect", title: "Plano perfeito", desc: "100% dos treinos da semana", icon: Award, unlocked: progress === 100 && trainingDays.length > 0 },
  ], [totalSessions, longestStreak, weekActive, weekTarget, progress, trainingDays.length]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (!plan) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Dashboard do <span className="gradient-text">herói</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Acompanhe sua evolução, mantenha a sequência e desbloqueie conquistas.</p>
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
              <div className="h-full" style={{ width: `${Math.min(100, (xp % 600) / 6)}%`, background: "var(--gradient-hero)" }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{xp} XP acumulados</div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Sequência atual</div>
                <div className="mt-1 font-display text-2xl font-bold">{streak} 🔥</div>
              </div>
              <Flame className="h-8 w-8 text-neon" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Recorde: {longestStreak} dias</div>
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
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Conquistas</div>
                <div className="mt-1 font-display text-2xl font-bold">{unlockedCount}/{achievements.length}</div>
              </div>
              <Trophy className="h-8 w-8 text-neon" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Meta: {plan.goalLabel}</div>
          </Card>
        </section>

        {/* Daily progression */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-6 md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">Progressão diária</h2>
                <p className="text-xs text-muted-foreground">Últimos 7 dias · meta de {weekTarget}x por semana</p>
              </div>
              <span className="text-xs text-muted-foreground">{weekActive}/{weekTarget}</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {last7.map((d, i) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <div
                    className={`grid h-14 w-full place-items-center rounded-xl border text-xs font-semibold transition ${
                      d.done
                        ? "border-primary bg-primary/10 text-foreground glow-primary"
                        : "border-white/10 bg-white/[0.02] text-muted-foreground"
                    } ${i === 6 ? "ring-1 ring-neon/40" : ""}`}
                  >
                    {d.done ? "✓" : d.label}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.date.slice(8)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full transition-all"
                style={{ width: `${Math.min(100, (weekActive / weekTarget) * 100)}%`, background: "var(--gradient-hero)" }}
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Treino de hoje</div>
            <div className="mt-1 font-display text-xl font-bold">
              {trainedToday ? "Mandou bem, herói!" : "Bora treinar?"}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {trainedToday
                ? "Você manteve sua sequência hoje. Volte amanhã para não perder o streak."
                : "Marque seu treino de hoje para somar XP e manter sua sequência."}
            </p>
            <button
              onClick={toggleToday}
              className={`mt-auto rounded-xl px-5 py-3 font-semibold transition ${
                trainedToday
                  ? "glass hover:bg-white/5"
                  : "btn-hero"
              }`}
            >
              {trainedToday ? "Desmarcar hoje" : "Marcar treino de hoje"}
            </button>
          </div>
        </section>

        {/* Achievements */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Conquistas</h2>
            <span className="text-sm text-muted-foreground">{unlockedCount} de {achievements.length} desbloqueadas</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a) => {
              const Icon = a.unlocked ? a.icon : Lock;
              return (
                <div
                  key={a.id}
                  className={`glass rounded-2xl p-5 transition ${
                    a.unlocked
                      ? "border-primary/40 glow-primary"
                      : "opacity-60"
                  }`}
                >
                  <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${
                    a.unlocked ? "btn-hero" : "bg-white/5"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display font-semibold">{a.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                  <div className={`mt-3 text-[11px] uppercase tracking-wide ${
                    a.unlocked ? "text-neon" : "text-muted-foreground"
                  }`}>
                    {a.unlocked ? "Desbloqueada" : "Bloqueada"}
                  </div>
                </div>
              );
            })}
          </div>
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

// Helper kept for legacy reference, no-op import guard
void Target;
