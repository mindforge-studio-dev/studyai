// types/streak.ts

export interface Trophy {
  id: string;
  icon: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  descEn: string;
  descFr: string;
  descAr: string;
  unlockedAt?: string;
}

export interface UserStats {
  userId: string;
  displayName: string;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  trophies: Trophy[];
  // Compteurs
  totalQuizzes: number;
  totalQuizPerfect: number; // score >= 80%
  totalSummaries: number;
  totalFlashcards: number;
  totalPlans: number;
  totalExplanations: number;
  totalSolutions: number;
  updatedAt: string;
}

export const TROPHY_DEFINITIONS: Omit<Trophy, "unlockedAt">[] = [
  {
    id: "first_flame",
    icon: "🔥",
    nameFr: "Première flamme",
    nameEn: "First Flame",
    nameAr: "الشعلة الأولى",
    descFr: "3 jours consécutifs",
    descEn: "3 consecutive days",
    descAr: "3 أيام متتالية",
  },
  {
    id: "electric",
    icon: "⚡",
    nameFr: "Électrique",
    nameEn: "Electric",
    nameAr: "كهربائي",
    descFr: "7 jours consécutifs",
    descEn: "7 consecutive days",
    descAr: "7 أيام متتالية",
  },
  {
    id: "unstoppable",
    icon: "🏆",
    nameFr: "Inarrêtable",
    nameEn: "Unstoppable",
    nameAr: "لا يُوقف",
    descFr: "30 jours consécutifs",
    descEn: "30 consecutive days",
    descAr: "30 يومًا متتاليًا",
  },
  {
    id: "quiz_master",
    icon: "🧠",
    nameFr: "Quiz Master",
    nameEn: "Quiz Master",
    nameAr: "ماستر الاختبارات",
    descFr: "10 quiz complétés",
    descEn: "10 quizzes completed",
    descAr: "10 اختبارات مكتملة",
  },
  {
    id: "perfectionist",
    icon: "🎯",
    nameFr: "Perfectionniste",
    nameEn: "Perfectionist",
    nameAr: "المثالي",
    descFr: "5 quiz avec score ≥ 80%",
    descEn: "5 quizzes with score ≥ 80%",
    descAr: "5 اختبارات بنتيجة ≥ 80%",
  },
  {
    id: "studious",
    icon: "📚",
    nameFr: "Studieux",
    nameEn: "Studious",
    nameAr: "المجتهد",
    descFr: "20 résumés générés",
    descEn: "20 summaries generated",
    descAr: "20 ملخصًا منشأً",
  },
  {
    id: "memorizer",
    icon: "🃏",
    nameFr: "Mémoriseur",
    nameEn: "Memorizer",
    nameAr: "الحافظ",
    descFr: "10 sets de flashcards",
    descEn: "10 flashcard sets",
    descAr: "10 مجموعات بطاقات",
  },
  {
    id: "rising_star",
    icon: "⭐",
    nameFr: "Étoile montante",
    nameEn: "Rising Star",
    nameAr: "النجم الصاعد",
    descFr: "Entrer dans le Top 10",
    descEn: "Enter the Top 10",
    descAr: "الدخول إلى أفضل 10",
  },
  {
    id: "champion",
    icon: "👑",
    nameFr: "Champion",
    nameEn: "Champion",
    nameAr: "البطل",
    descFr: "Atteindre le Top 3",
    descEn: "Reach the Top 3",
    descAr: "الوصول إلى أفضل 3",
  },
];

export const POINTS = {
  QUIZ_COMPLETED: 10,
  QUIZ_PERFECT: 5,
  SUMMARY: 5,
  FLASHCARDS: 5,
  PLAN: 5,
  EXPLANATION: 3,
  SOLUTION: 3,
  CHAT: 2,
  STREAK_DAY: 2,
} as const;