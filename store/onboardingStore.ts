// store/onboardingStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "studyai_onboarding_done";

interface OnboardingState {
  onboardingDone: boolean | null;
  checkOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  onboardingDone: null,

  checkOnboarding: async () => {
    const val = await AsyncStorage.getItem(ONBOARDING_KEY);
    set({ onboardingDone: val === "true" });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ onboardingDone: true });
  },
}));