// store/streakStore.ts
import { create } from "zustand";
import {
  getFirestore, doc, getDoc, setDoc,
  updateDoc, collection, query,
  orderBy, limit, getDocs, increment,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  UserStats, Trophy, TROPHY_DEFINITIONS, POINTS,
} from "../types/streak";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getYesterdayDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

interface StreakState {
  stats: UserStats | null;
  leaderboard: UserStats[];
  isLoading: boolean;
  newTrophies: Trophy[];
  loadStats: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  addPoints: (type: keyof typeof POINTS, extra?: { quizScore?: number; quizTotal?: number }) => Promise<void>;
  clearNewTrophies: () => void;
}

const checkAndUnlockTrophies = (stats: UserStats): Trophy[] => {
  const newTrophies: Trophy[] = [];
  const unlockedIds = stats.trophies.map((t) => t.id);

  for (const def of TROPHY_DEFINITIONS) {
    if (unlockedIds.includes(def.id)) continue;

    let unlocked = false;

    if (def.id === "first_flame" && stats.currentStreak >= 3) unlocked = true;
    if (def.id === "electric" && stats.currentStreak >= 7) unlocked = true;
    if (def.id === "unstoppable" && stats.currentStreak >= 30) unlocked = true;
    if (def.id === "quiz_master" && stats.totalQuizzes >= 10) unlocked = true;
    if (def.id === "perfectionist" && stats.totalQuizPerfect >= 5) unlocked = true;
    if (def.id === "studious" && stats.totalSummaries >= 20) unlocked = true;
    if (def.id === "memorizer" && stats.totalFlashcards >= 10) unlocked = true;

    if (unlocked) {
      newTrophies.push({ ...def, unlockedAt: new Date().toISOString() });
    }
  }

  return newTrophies;
};

const updateStreak = (stats: UserStats): { streak: number; points: number } => {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (stats.lastActiveDate === today) {
    return { streak: stats.currentStreak, points: 0 };
  }

  if (stats.lastActiveDate === yesterday) {
    return { streak: stats.currentStreak + 1, points: POINTS.STREAK_DAY };
  }

  return { streak: 1, points: POINTS.STREAK_DAY };
};

export const useStreakStore = create<StreakState>((set, get) => ({
  stats: null,
  leaderboard: [],
  isLoading: false,
  newTrophies: [],

  loadStats: async () => {
    const app = getApp();
    const db = getFirestore(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) return;

    set({ isLoading: true });
    try {
      const ref = doc(db, "userStats", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        set({ stats: snap.data() as UserStats });
      } else {
        // Récupère le displayName depuis users
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const firstName = userSnap.exists() ? userSnap.data().firstName || "" : "";
        const lastName = userSnap.exists() ? userSnap.data().lastName || "" : "";
        const displayName = `${firstName} ${lastName}`.trim() || user.email?.split("@")[0] || "Student";

        const newStats: UserStats = {
          userId: user.uid,
          displayName,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: "",
          trophies: [],
          totalQuizzes: 0,
          totalQuizPerfect: 0,
          totalSummaries: 0,
          totalFlashcards: 0,
          totalPlans: 0,
          totalExplanations: 0,
          totalSolutions: 0,
          updatedAt: new Date().toISOString(),
        };

        await setDoc(ref, newStats);
        set({ stats: newStats });
      }
    } catch (e) {
      console.error("loadStats error:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  loadLeaderboard: async () => {
    const app = getApp();
    const db = getFirestore(app);
    try {
      const q = query(
        collection(db, "userStats"),
        orderBy("totalPoints", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => d.data() as UserStats);
      set({ leaderboard: data });
    } catch (e) {
      console.error("loadLeaderboard error:", e);
    }
  },

  addPoints: async (type, extra) => {
    const app = getApp();
    const db = getFirestore(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) return;

    const { stats } = get();
    if (!stats) return;

    let pointsToAdd = POINTS[type];
    const updates: Record<string, any> = {};

    // Points bonus quiz parfait
    if (type === "QUIZ_COMPLETED" && extra?.quizScore !== undefined && extra?.quizTotal !== undefined) {
      const pct = extra.quizScore / extra.quizTotal;
      if (pct >= 0.8) {
        pointsToAdd += POINTS.QUIZ_PERFECT;
        updates.totalQuizPerfect = increment(1);
      }
      updates.totalQuizzes = increment(1);
    }
    if (type === "SUMMARY") updates.totalSummaries = increment(1);
    if (type === "FLASHCARDS") updates.totalFlashcards = increment(1);
    if (type === "PLAN") updates.totalPlans = increment(1);
    if (type === "EXPLANATION") updates.totalExplanations = increment(1);
    if (type === "SOLUTION") updates.totalSolutions = increment(1);

    // Streak
    const { streak, points: streakPoints } = updateStreak(stats);
    pointsToAdd += streakPoints;

    const newStats: UserStats = {
      ...stats,
      totalPoints: stats.totalPoints + pointsToAdd,
      currentStreak: streak,
      longestStreak: Math.max(stats.longestStreak, streak),
      lastActiveDate: getTodayDate(),
      totalQuizzes: type === "QUIZ_COMPLETED" ? stats.totalQuizzes + 1 : stats.totalQuizzes,
      totalQuizPerfect: (type === "QUIZ_COMPLETED" && extra?.quizScore !== undefined && extra?.quizTotal !== undefined && extra.quizScore / extra.quizTotal >= 0.8) ? stats.totalQuizPerfect + 1 : stats.totalQuizPerfect,
      totalSummaries: type === "SUMMARY" ? stats.totalSummaries + 1 : stats.totalSummaries,
      totalFlashcards: type === "FLASHCARDS" ? stats.totalFlashcards + 1 : stats.totalFlashcards,
      totalPlans: type === "PLAN" ? stats.totalPlans + 1 : stats.totalPlans,
      totalExplanations: type === "EXPLANATION" ? stats.totalExplanations + 1 : stats.totalExplanations,
      totalSolutions: type === "SOLUTION" ? stats.totalSolutions + 1 : stats.totalSolutions,
      updatedAt: new Date().toISOString(),
    };

    // Vérifie les trophées
    const unlocked = checkAndUnlockTrophies(newStats);
    if (unlocked.length > 0) {
      newStats.trophies = [...stats.trophies, ...unlocked];
      set({ newTrophies: unlocked });
    }

    // Vérifie trophées classement (sera vérifié après loadLeaderboard)
    set({ stats: newStats });

    const ref = doc(db, "userStats", user.uid);
    await updateDoc(ref, {
      totalPoints: increment(pointsToAdd),
      currentStreak: streak,
      longestStreak: Math.max(stats.longestStreak, streak),
      lastActiveDate: getTodayDate(),
      trophies: newStats.trophies,
      updatedAt: new Date().toISOString(),
      ...updates,
    });
  },

  clearNewTrophies: () => set({ newTrophies: [] }),
}));