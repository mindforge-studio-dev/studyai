// components/GoogleSignInButton.tsx
import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";

interface Props {
  onPress: () => void;
  isLoading?: boolean;
  label: string;
}

export const GoogleSignInButton = ({ onPress, isLoading, label }: Props) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={isLoading}
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 14, padding: 14,
      flexDirection: "row", alignItems: "center",
      justifyContent: "center", gap: 10,
      borderWidth: 1, borderColor: "#E5E7EB",
      elevation: 2,
    }}
  >
    {isLoading ? (
      <ActivityIndicator size="small" color="#6366F1" />
    ) : (
      <>
        {/* Logo Google SVG simplifié */}
        <View style={{
          width: 22, height: 22, borderRadius: 11,
          backgroundColor: "#F8F9FA", alignItems: "center",
          justifyContent: "center",
        }}>
          <Text style={{ fontSize: 14, fontWeight: "800", color: "#4285F4" }}>G</Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>
          {label}
        </Text>
      </>
    )}
  </TouchableOpacity>
);