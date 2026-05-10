// components/OfflineBanner.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useLanguageStore } from "../store/languageStore";

export const OfflineBanner = () => {
  const { isOffline } = useNetworkStatus();
  const { currentLanguage } = useLanguageStore();
  const translateY = useRef(new Animated.Value(-60)).current;
  const isRTL = currentLanguage === "ar";

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  const getMessage = () => {
    if (currentLanguage === "ar") return "لا يوجد اتصال بالإنترنت";
    if (currentLanguage === "en") return "No internet connection";
    return "Pas de connexion internet";
  };

  const getSubMessage = () => {
    if (currentLanguage === "ar") return "بعض الميزات غير متاحة";
    if (currentLanguage === "en") return "Some features are unavailable";
    return "Certaines fonctionnalités sont indisponibles";
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: "#EF4444",
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 10,
        elevation: 10,
      }}
    >
      <Ionicons name="cloud-offline-outline" size={20} color="#FFFFFF" />
      <View style={{ flex: 1 }}>
        <Text style={{
          color: "#FFFFFF",
          fontWeight: "700",
          fontSize: 13,
          textAlign: isRTL ? "right" : "left",
        }}>
          {getMessage()}
        </Text>
        <Text style={{
          color: "#FEE2E2",
          fontSize: 11,
          marginTop: 1,
          textAlign: isRTL ? "right" : "left",
        }}>
          {getSubMessage()}
        </Text>
      </View>
    </Animated.View>
  );
};