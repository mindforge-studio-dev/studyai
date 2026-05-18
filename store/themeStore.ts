import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

type ThemeMode = "system" | "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  syncWithSystem: () => void;
}

const getSystemIsDark = () => Appearance.getColorScheme() === "dark";

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "system",
      isDark: getSystemIsDark(),

      setMode: (mode: ThemeMode) => {
        const isDark =
          mode === "system" ? getSystemIsDark() : mode === "dark";
        set({ mode, isDark });
      },

      syncWithSystem: () => {
        const { mode } = get();
        if (mode === "system") {
          set({ isDark: getSystemIsDark() });
        }
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
