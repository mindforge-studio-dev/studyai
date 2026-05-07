// components/ShareButton.tsx
import React from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

interface Props {
  content: string;
  title?: string;
  currentLanguage: string;
  isRTL: boolean;
}

export const ShareButton: React.FC<Props> = ({
  content,
  title,
  currentLanguage,
  isRTL,
}) => {
  const getLabel = (fr: string, en: string, ar: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "en" ? en : fr;

  const handleShare = async () => {
    try {
      await Share.share({
        message: title ? `${title}\n\n${content}\n\n— StudyAI` : `${content}\n\n— StudyAI`,
        title: "StudyAI",
      });
    } catch (e: any) {
      Alert.alert("", e.message);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
    Alert.alert("✅", getLabel(
      "Copié dans le presse-papiers !",
      "Copied to clipboard!",
      "تم النسخ إلى الحافظة!"
    ));
  };

  return (
    <View style={{
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 10, marginTop: 12,
    }}>
      {/* Bouton Copier */}
      <TouchableOpacity
        onPress={handleCopy}
        style={{
          flex: 1, flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center", justifyContent: "center",
          backgroundColor: "#F3F4F6", borderRadius: 12,
          padding: 12, gap: 6,
          borderWidth: 1, borderColor: "#E5E7EB",
        }}
      >
        <Ionicons name="copy-outline" size={16} color="#374151" />
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}>
          {getLabel("Copier", "Copy", "نسخ")}
        </Text>
      </TouchableOpacity>

      {/* Bouton Partager */}
      <TouchableOpacity
        onPress={handleShare}
        style={{
          flex: 1, flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: "center", justifyContent: "center",
          backgroundColor: "#EEF2FF", borderRadius: 12,
          padding: 12, gap: 6,
          borderWidth: 1, borderColor: "#C7D2FE",
        }}
      >
        <Ionicons name="share-social-outline" size={16} color="#6366F1" />
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#6366F1" }}>
          {getLabel("Partager", "Share", "مشاركة")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};