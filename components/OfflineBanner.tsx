// components/OfflineBanner.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useLanguageStore } from "../store/languageStore";

export const OfflineBanner = () => {
  const { isOffline } = useNetworkStatus();
  const { currentLanguage } = useLanguageStore();
  const translateY = useRef(new Animated.Value(-60)).current;
  const isRTL = currentLanguage === "ar";

  // true = rouge (hors ligne), false = vert (reconnecté)
  const [showGreen, setShowGreen] = useState(false);
  const wasOffline = useRef(false);
  const greenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOffline) {
      // Hors ligne — affiche rouge
      wasOffline.current = true;
      setShowGreen(false);
      if (greenTimer.current) clearTimeout(greenTimer.current);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

    } else if (wasOffline.current) {
      // Reconnecté — affiche vert 2 secondes puis cache
      setShowGreen(true);

      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      greenTimer.current = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -60,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowGreen(false);
          wasOffline.current = false;
        });
      }, 2000);
    }

    return () => {
      if (greenTimer.current) clearTimeout(greenTimer.current);
    };
  }, [isOffline]);

  const getOfflineMessage = () => {
    if (currentLanguage === "ar") return "لا يوجد اتصال بالإنترنت";
    if (currentLanguage === "en") return "No internet connection";
    return "Pas de connexion internet";
  };

  const getOfflineSubMessage = () => {
    if (currentLanguage === "ar") return "بعض الميزات غير متاحة";
    if (currentLanguage === "en") return "Some features are unavailable";
    return "Certaines fonctionnalités sont indisponibles";
  };

  const getOnlineMessage = () => {
    if (currentLanguage === "ar") return "تمت استعادة الاتصال";
    if (currentLanguage === "en") return "Connection restored";
    return "Connexion rétablie";
  };

  const getOnlineSubMessage = () => {
    if (currentLanguage === "ar") return "كل الميزات متاحة مجدداً";
    if (currentLanguage === "en") return "All features are available again";
    return "Toutes les fonctionnalités sont disponibles";
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
        backgroundColor: showGreen ? "#10B981" : "#EF4444",
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: 10,
        elevation: 10,
      }}
    >
      <Ionicons
        name={showGreen ? "checkmark-circle-outline" : "cloud-offline-outline"}
        size={20}
        color="#FFFFFF"
      />
      <View style={{ flex: 1 }}>
        <Text style={{
          color: "#FFFFFF",
          fontWeight: "700",
          fontSize: 13,
          textAlign: isRTL ? "right" : "left",
        }}>
          {showGreen ? getOnlineMessage() : getOfflineMessage()}
        </Text>
        <Text style={{
          color: showGreen ? "#D1FAE5" : "#FEE2E2",
          fontSize: 11,
          marginTop: 1,
          textAlign: isRTL ? "right" : "left",
        }}>
          {showGreen ? getOnlineSubMessage() : getOfflineSubMessage()}
        </Text>
      </View>
    </Animated.View>
  );
};