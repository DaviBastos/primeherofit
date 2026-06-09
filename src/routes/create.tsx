import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePlan, savePlan, type ProfileInput } from "@/lib/plan";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Criar plano · HeroFit AI" }] }),
  component: CreatePage,
});

type Form = Partial<ProfileInput>;

const steps = ["Dados básicos", "Físico", "Experiência", "Objetivo", "Rotina"] as const;

function CreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({
    sex: "masculino",
    experience: "iniciante",
    goal: "hipertrofia",
    place: "academia",
    daysPerWeek: 4,
    minutesPerSession: 45,
  });

  const set = <K extends keyof ProfileInput>(k: K, v: ProfileInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!form.name && !!form.age && !!form.sex;
    if (step === 1) return !!form.weight && !!form.height;
    if (step === 2) return !!form.experience;
    if (step === 3) return !!form.goal;
    if (step === 4) return !!form.place && !!form.daysPerWeek && !!form.minutesPerSession;
    return false;
  };

  const submit = () => {
    const plan = generatePlan(form as ProfileInput);
    savePlan(plan);
    navigate({ to: "/loading" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Stepper */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Passo {step + 1} de {steps.length}</span>
            <span>{steps[step]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%`, background: "var(--gradient-hero)" }}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-8 animate-fade-up">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Quem é o herói?</h2>
              <Field label="Nome">
                <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Seu nome" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Idade">
                  <Input type="number" min={12} max={100} value={form.age ?? ""} onChange={(e) => set("age", +e.target.value)} placeholder="25" />
                </Field>
                <Field label="Sexo">
                  <Choices
                    value={form.sex}
                    onChange={(v) => set("sex", v as ProfileInput["sex"])}
                    options={[
                      { v: "masculino", l: "Masculino" },
                      { v: "feminino", l: "Feminino" },
                      { v: "outro", l: "Outro" },
                    ]}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Seus dados físicos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Peso (kg)">
                  <Input type="number" min={30} max={250} value={form.weight ?? ""} onChange={(e) => set("weight", +e.target.value)} placeholder="70" />
                </Field>
                <Field label="Altura (cm)">
                  <Input type="number" min={120} max={230} value={form.height ?? ""} onChange={(e) => set("height", +e.target.value)} placeholder="175" />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Seu nível</h2>
              <Choices
                value={form.experience}
                onChange={(v) => set("experience", v as ProfileInput["experience"])}
                options={[
                  { v: "iniciante", l: "Iniciante", d: "Pouca ou nenhuma experiência" },
                  { v: "intermediario", l: "Intermediário", d: "Treino há mais de 6 meses" },
                  { v: "avancado", l: "Avançado", d: "Treino consistente há mais de 2 anos" },
                ]}
                vertical
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-bold">Qual sua missão?</h2>
              <Choices
                value={form.goal}
                onChange={(v) => set("goal", v as ProfileInput["goal"])}
                options={[
                  { v: "emagrecimento", l: "Emagrecimento" },
                  { v: "hipertrofia", l: "Hipertrofia" },
                  { v: "condicionamento", l: "Condicionamento" },
                  { v: "saude", l: "Saúde geral" },
                ]}
                grid
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Sua rotina</h2>
              <Field label="Onde você treina?">
                <Choices
                  value={form.place}
                  onChange={(v) => set("place", v as ProfileInput["place"])}
                  options={[
                    { v: "academia", l: "Academia" },
                    { v: "casa", l: "Casa" },
                    { v: "ar-livre", l: "Ao ar livre" },
                  ]}
                />
              </Field>
              <Field label={`Dias por semana: ${form.daysPerWeek}`}>
                <input
                  type="range" min={1} max={7} value={form.daysPerWeek}
                  onChange={(e) => set("daysPerWeek", +e.target.value)}
                  className="w-full accent-[oklch(0.68_0.22_260)]"
                />
              </Field>
              <Field label="Tempo por treino">
                <Choices
                  value={String(form.minutesPerSession)}
                  onChange={(v) => set("minutesPerSession", +v)}
                  options={[20, 30, 45, 60, 90].map((m) => ({ v: String(m), l: `${m} min` }))}
                />
              </Field>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
            {step < steps.length - 1 ? (
              <button
                disabled={!canNext()}
                onClick={() => setStep((s) => s + 1)}
                className="btn-hero rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar <ChevronRight className="ml-1 inline h-4 w-4" />
              </button>
            ) : (
              <button
                disabled={!canNext()}
                onClick={submit}
                className="btn-hero rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
              >
                <Sparkles className="mr-1 inline h-4 w-4" /> Gerar plano com IA
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Choices({
  value, onChange, options, vertical, grid,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  options: { v: string; l: string; d?: string }[];
  vertical?: boolean;
  grid?: boolean;
}) {
  const cls = vertical
    ? "flex flex-col gap-2"
    : grid
      ? "grid grid-cols-2 gap-2"
      : "flex flex-wrap gap-2";
  return (
    <div className={cls}>
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              active
                ? "border-primary bg-primary/10 text-foreground glow-primary"
                : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
            }`}
          >
            <div className="font-medium">{o.l}</div>
            {o.d && <div className="mt-0.5 text-xs opacity-70">{o.d}</div>}
          </button>
        );
      })}
    </div>
  );
}
