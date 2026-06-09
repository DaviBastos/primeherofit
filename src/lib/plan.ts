export type Experience = "iniciante" | "intermediario" | "avancado";
export type Goal = "emagrecimento" | "hipertrofia" | "condicionamento" | "saude";
export type Place = "academia" | "casa" | "ar-livre";

export interface ProfileInput {
  name: string;
  age: number;
  sex: "masculino" | "feminino" | "outro";
  weight: number;
  height: number;
  experience: Experience;
  goal: Goal;
  place: Place;
  daysPerWeek: number;
  minutesPerSession: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
  estimatedMinutes: number;
  rest?: boolean;
}

export interface Mission {
  title: string;
  description: string;
  progress: number;
}

export interface Plan {
  profile: ProfileInput;
  goalLabel: string;
  level: string;
  week: DayPlan[];
  missions: Mission[];
}

const goalLabels: Record<Goal, string> = {
  emagrecimento: "Queimar gordura",
  hipertrofia: "Ganhar massa muscular",
  condicionamento: "Melhorar condicionamento",
  saude: "Saúde geral",
};

const dayNames = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const libraries: Record<Place, Record<Goal, { focus: string; ex: Exercise[] }[]>> = {
  academia: {
    hipertrofia: [
      { focus: "Peito & Tríceps", ex: [
        { name: "Supino reto", sets: 4, reps: "8-10", rest: "90s" },
        { name: "Supino inclinado halteres", sets: 4, reps: "10", rest: "75s" },
        { name: "Crucifixo na máquina", sets: 3, reps: "12", rest: "60s" },
        { name: "Tríceps na polia", sets: 4, reps: "12", rest: "60s" },
        { name: "Francês com halter", sets: 3, reps: "10-12", rest: "60s" },
      ]},
      { focus: "Costas & Bíceps", ex: [
        { name: "Puxada frontal", sets: 4, reps: "10", rest: "75s" },
        { name: "Remada curvada", sets: 4, reps: "8-10", rest: "90s" },
        { name: "Remada baixa", sets: 3, reps: "12", rest: "60s" },
        { name: "Rosca direta barra", sets: 4, reps: "10", rest: "60s" },
        { name: "Rosca martelo", sets: 3, reps: "12", rest: "60s" },
      ]},
      { focus: "Pernas & Glúteos", ex: [
        { name: "Agachamento livre", sets: 4, reps: "8", rest: "120s" },
        { name: "Leg press 45º", sets: 4, reps: "12", rest: "90s" },
        { name: "Cadeira extensora", sets: 3, reps: "15", rest: "60s" },
        { name: "Mesa flexora", sets: 3, reps: "12", rest: "60s" },
        { name: "Elevação pélvica", sets: 4, reps: "12", rest: "75s" },
      ]},
      { focus: "Ombros & Core", ex: [
        { name: "Desenvolvimento halteres", sets: 4, reps: "10", rest: "75s" },
        { name: "Elevação lateral", sets: 4, reps: "12", rest: "45s" },
        { name: "Face pull", sets: 3, reps: "15", rest: "45s" },
        { name: "Prancha", sets: 3, reps: "45s", rest: "30s" },
        { name: "Abdominal infra", sets: 3, reps: "15", rest: "30s" },
      ]},
    ],
    emagrecimento: [
      { focus: "HIIT Full Body", ex: [
        { name: "Burpees", sets: 5, reps: "30s on / 30s off", rest: "30s" },
        { name: "Kettlebell swing", sets: 5, reps: "20", rest: "45s" },
        { name: "Remada com halter", sets: 4, reps: "12", rest: "45s" },
        { name: "Mountain climbers", sets: 4, reps: "40s", rest: "30s" },
        { name: "Esteira intervalado", sets: 1, reps: "15 min", rest: "-" },
      ]},
      { focus: "Cardio + Pernas", ex: [
        { name: "Agachamento goblet", sets: 4, reps: "15", rest: "45s" },
        { name: "Avanço alternado", sets: 4, reps: "12 cada", rest: "45s" },
        { name: "Step up", sets: 3, reps: "15 cada", rest: "30s" },
        { name: "Bike ergométrica", sets: 1, reps: "20 min", rest: "-" },
      ]},
      { focus: "Circuito Superior", ex: [
        { name: "Supino halteres", sets: 4, reps: "12", rest: "45s" },
        { name: "Remada baixa", sets: 4, reps: "12", rest: "45s" },
        { name: "Desenvolvimento", sets: 3, reps: "12", rest: "45s" },
        { name: "Corda naval", sets: 4, reps: "30s", rest: "30s" },
      ]},
    ],
    condicionamento: [
      { focus: "Cardio Estrutural", ex: [
        { name: "Aquecimento esteira", sets: 1, reps: "5 min", rest: "-" },
        { name: "Intervalado bike", sets: 8, reps: "1 min forte / 1 min leve", rest: "-" },
        { name: "Remada baixa", sets: 3, reps: "12", rest: "60s" },
        { name: "Prancha lateral", sets: 3, reps: "30s cada", rest: "30s" },
      ]},
      { focus: "Força Funcional", ex: [
        { name: "Agachamento", sets: 4, reps: "10", rest: "75s" },
        { name: "Levantamento terra", sets: 4, reps: "8", rest: "90s" },
        { name: "Push press", sets: 3, reps: "8", rest: "75s" },
        { name: "Farmer walk", sets: 3, reps: "30m", rest: "60s" },
      ]},
    ],
    saude: [
      { focus: "Corpo Inteiro Leve", ex: [
        { name: "Esteira caminhada", sets: 1, reps: "10 min", rest: "-" },
        { name: "Leg press", sets: 3, reps: "12", rest: "60s" },
        { name: "Puxada frontal", sets: 3, reps: "12", rest: "60s" },
        { name: "Supino máquina", sets: 3, reps: "12", rest: "60s" },
        { name: "Abdominal", sets: 3, reps: "15", rest: "30s" },
      ]},
      { focus: "Mobilidade & Core", ex: [
        { name: "Alongamento dinâmico", sets: 1, reps: "8 min", rest: "-" },
        { name: "Prancha", sets: 3, reps: "40s", rest: "30s" },
        { name: "Bird dog", sets: 3, reps: "10 cada", rest: "30s" },
        { name: "Glute bridge", sets: 3, reps: "15", rest: "30s" },
      ]},
    ],
  },
  casa: {
    hipertrofia: [
      { focus: "Push (Peito/Ombro/Tríceps)", ex: [
        { name: "Flexão de braço", sets: 4, reps: "máx", rest: "60s" },
        { name: "Flexão diamante", sets: 3, reps: "10", rest: "60s" },
        { name: "Pike push-up", sets: 3, reps: "10", rest: "60s" },
        { name: "Mergulho na cadeira", sets: 3, reps: "12", rest: "45s" },
      ]},
      { focus: "Pull (Costas/Bíceps)", ex: [
        { name: "Remada com mochila", sets: 4, reps: "12", rest: "60s" },
        { name: "Superman", sets: 3, reps: "15", rest: "45s" },
        { name: "Rosca com garrafa", sets: 3, reps: "15", rest: "45s" },
        { name: "Pull-up (se possível)", sets: 4, reps: "máx", rest: "75s" },
      ]},
      { focus: "Pernas", ex: [
        { name: "Agachamento livre", sets: 4, reps: "20", rest: "60s" },
        { name: "Avanço", sets: 4, reps: "12 cada", rest: "60s" },
        { name: "Búlgaro", sets: 3, reps: "10 cada", rest: "60s" },
        { name: "Glute bridge", sets: 4, reps: "20", rest: "45s" },
      ]},
    ],
    emagrecimento: [
      { focus: "HIIT em Casa", ex: [
        { name: "Jumping jacks", sets: 4, reps: "45s", rest: "15s" },
        { name: "Burpees", sets: 4, reps: "30s", rest: "30s" },
        { name: "High knees", sets: 4, reps: "30s", rest: "30s" },
        { name: "Mountain climbers", sets: 4, reps: "40s", rest: "20s" },
        { name: "Prancha", sets: 3, reps: "40s", rest: "20s" },
      ]},
      { focus: "Circuito Total", ex: [
        { name: "Agachamento com salto", sets: 4, reps: "15", rest: "45s" },
        { name: "Flexão", sets: 4, reps: "12", rest: "45s" },
        { name: "Abdominal bicicleta", sets: 4, reps: "20", rest: "30s" },
        { name: "Skater jumps", sets: 4, reps: "30s", rest: "30s" },
      ]},
    ],
    condicionamento: [
      { focus: "Cardio Funcional", ex: [
        { name: "Polichinelo", sets: 4, reps: "1 min", rest: "30s" },
        { name: "Corrida estacionária", sets: 4, reps: "1 min", rest: "30s" },
        { name: "Agachamento", sets: 4, reps: "20", rest: "45s" },
        { name: "Prancha dinâmica", sets: 3, reps: "40s", rest: "30s" },
      ]},
      { focus: "Core & Estabilidade", ex: [
        { name: "Prancha", sets: 4, reps: "45s", rest: "30s" },
        { name: "Russian twist", sets: 3, reps: "20", rest: "30s" },
        { name: "Dead bug", sets: 3, reps: "12 cada", rest: "30s" },
        { name: "Hollow hold", sets: 3, reps: "30s", rest: "30s" },
      ]},
    ],
    saude: [
      { focus: "Mobilidade & Corpo Inteiro", ex: [
        { name: "Alongamento ativo", sets: 1, reps: "8 min", rest: "-" },
        { name: "Agachamento", sets: 3, reps: "15", rest: "45s" },
        { name: "Flexão de joelhos", sets: 3, reps: "10", rest: "45s" },
        { name: "Glute bridge", sets: 3, reps: "15", rest: "30s" },
        { name: "Prancha", sets: 3, reps: "30s", rest: "30s" },
      ]},
    ],
  },
  "ar-livre": {
    hipertrofia: [
      { focus: "Calistenia Push", ex: [
        { name: "Flexão", sets: 5, reps: "máx", rest: "60s" },
        { name: "Mergulho em banco", sets: 4, reps: "12", rest: "60s" },
        { name: "Pike push-up", sets: 4, reps: "10", rest: "60s" },
      ]},
      { focus: "Calistenia Pull", ex: [
        { name: "Barra fixa", sets: 5, reps: "máx", rest: "90s" },
        { name: "Australian row", sets: 4, reps: "12", rest: "60s" },
        { name: "Superman", sets: 3, reps: "15", rest: "45s" },
      ]},
      { focus: "Pernas Outdoor", ex: [
        { name: "Agachamento pistola assistido", sets: 4, reps: "8 cada", rest: "75s" },
        { name: "Avanço caminhando", sets: 4, reps: "20 passos", rest: "60s" },
        { name: "Salto na caixa", sets: 4, reps: "10", rest: "60s" },
      ]},
    ],
    emagrecimento: [
      { focus: "Corrida Intervalada", ex: [
        { name: "Aquecimento trote", sets: 1, reps: "5 min", rest: "-" },
        { name: "Sprint", sets: 8, reps: "30s sprint / 60s leve", rest: "-" },
        { name: "Volta calma", sets: 1, reps: "5 min", rest: "-" },
      ]},
      { focus: "Circuito Parque", ex: [
        { name: "Burpees", sets: 4, reps: "15", rest: "45s" },
        { name: "Agachamento com salto", sets: 4, reps: "15", rest: "45s" },
        { name: "Mountain climbers", sets: 4, reps: "40s", rest: "30s" },
        { name: "Prancha", sets: 3, reps: "45s", rest: "30s" },
      ]},
    ],
    condicionamento: [
      { focus: "Run + Strength", ex: [
        { name: "Corrida leve", sets: 1, reps: "20 min", rest: "-" },
        { name: "Flexão", sets: 4, reps: "15", rest: "45s" },
        { name: "Agachamento", sets: 4, reps: "20", rest: "45s" },
      ]},
    ],
    saude: [
      { focus: "Caminhada Ativa", ex: [
        { name: "Caminhada rápida", sets: 1, reps: "30 min", rest: "-" },
        { name: "Agachamento livre", sets: 3, reps: "15", rest: "45s" },
        { name: "Prancha", sets: 3, reps: "30s", rest: "30s" },
      ]},
    ],
  },
};

export function generatePlan(profile: ProfileInput): Plan {
  const pool = libraries[profile.place][profile.goal];
  const factor = profile.experience === "iniciante" ? 0.7 : profile.experience === "avancado" ? 1.15 : 1;

  const week: DayPlan[] = [];
  let workoutIdx = 0;
  const trainingDays = Math.min(profile.daysPerWeek, 7);
  // distribute training days across week
  const indices = new Set<number>();
  const step = 7 / trainingDays;
  for (let i = 0; i < trainingDays; i++) indices.add(Math.floor(i * step));

  for (let d = 0; d < 7; d++) {
    if (indices.has(d)) {
      const tpl = pool[workoutIdx % pool.length];
      workoutIdx++;
      const adjusted = tpl.ex.map((e) => ({
        ...e,
        sets: Math.max(2, Math.round(e.sets * factor)),
      }));
      week.push({
        day: dayNames[d],
        focus: tpl.focus,
        exercises: adjusted,
        estimatedMinutes: profile.minutesPerSession,
      });
    } else {
      week.push({ day: dayNames[d], focus: "Descanso ativo", exercises: [], estimatedMinutes: 0, rest: true });
    }
  }

  const missions: Mission[] = [
    { title: "Missão 1: Construir resistência", description: "Complete 4 treinos consecutivos sem falhar.", progress: 0 },
    { title: "Missão 2: Aumentar força", description: "Progrida nas cargas/repetições por 2 semanas.", progress: 0 },
    { title: "Missão 3: Evoluir condicionamento", description: "Reduza o tempo de descanso em 15% até o fim do mês.", progress: 0 },
  ];

  return {
    profile,
    goalLabel: goalLabels[profile.goal],
    level: profile.experience === "iniciante" ? "Recruta" : profile.experience === "intermediario" ? "Guerreiro" : "Lendário",
    week,
    missions,
  };
}

const STORAGE_KEY = "herofit:plan";

export function savePlan(plan: Plan) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}
export function loadPlan(): Plan | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Plan; } catch { return null; }
}
