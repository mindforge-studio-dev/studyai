// app/notification-settings.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLanguageStore } from "../store/languageStore";
import { useNotificationStore } from "../store/notificationStore";
import { sendTestNotification } from "../services/notifications";

export default function NotificationSettingsScreen() {
  const { currentLanguage } = useLanguageStore();
  const isRTL = currentLanguage === "ar";
  const {
    settings, hasPermission, loadSettings,
    toggleEnabled, toggleStudyReminder, togglePlanAlerts,
    setReminderTime, checkPermission,
  } = useNotificationStore();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const getLabel = (fr: string, en: string, ar: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "en" ? en : fr;

  useEffect(() => {
    loadSettings(currentLanguage);
    checkPermission();
  }, []);

  const reminderTime = new Date();
  reminderTime.setHours(settings.studyReminderHour, settings.studyReminderMinute, 0, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* Header */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
            🔔 {getLabel("Notifications", "Notifications", "الإشعارات")}
          </Text>
        </View>

        {/* Alerte permission */}
        {!hasPermission && (
          <TouchableOpacity
            onPress={checkPermission}
            style={{
              backgroundColor: "#FFFBEB", borderRadius: 12, padding: 12,
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center", marginBottom: 16,
              borderWidth: 1, borderColor: "#FCD34D", gap: 8,
            }}
          >
            <Ionicons name="warning-outline" size={18} color="#F59E0B" />
            <Text style={{ fontSize: 13, color: "#92400E", flex: 1, textAlign: isRTL ? "right" : "left" }}>
              {getLabel(
                "Autorise les notifications pour activer les rappels",
                "Allow notifications to enable reminders",
                "اسمح بالإشعارات لتفعيل التذكيرات"
              )}
            </Text>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={14} color="#F59E0B" />
          </TouchableOpacity>
        )}

        {/* Paramètres */}
        <View style={{
          backgroundColor: "#FFFFFF", borderRadius: 14,
          borderWidth: 1, borderColor: "#F3F4F6", overflow: "hidden",
        }}>

          {/* Activer notifications */}
          <View style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center", padding: 16,
            borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10, backgroundColor: "#6366F115",
              alignItems: "center", justifyContent: "center",
              marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
            }}>
              <Ionicons name="notifications-outline" size={18} color="#6366F1" />
            </View>
            <Text style={{ fontSize: 14, color: "#374151", flex: 1, textAlign: isRTL ? "right" : "left" }}>
              {getLabel("Activer les notifications", "Enable notifications", "تفعيل الإشعارات")}
            </Text>
            <Switch
              value={settings.enabled}
              onValueChange={() => toggleEnabled(currentLanguage)}
              trackColor={{ false: "#E5E7EB", true: "#A5B4FC" }}
              thumbColor={settings.enabled ? "#6366F1" : "#9CA3AF"}
            />
          </View>

          {/* Rappel quotidien */}
          <View style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center", padding: 16,
            borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
            opacity: settings.enabled ? 1 : 0.4,
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10, backgroundColor: "#10B98115",
              alignItems: "center", justifyContent: "center",
              marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
            }}>
              <Ionicons name="book-outline" size={18} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "#374151", textAlign: isRTL ? "right" : "left" }}>
                {getLabel("Rappel d'étude quotidien", "Daily study reminder", "تذكير يومي للدراسة")}
              </Text>
              <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2, textAlign: isRTL ? "right" : "left" }}>
                {String(settings.studyReminderHour).padStart(2, "0")}:{String(settings.studyReminderMinute).padStart(2, "0")}
              </Text>
            </View>
            <Switch
              value={settings.studyReminderEnabled}
              onValueChange={() => { if (!settings.enabled) return; toggleStudyReminder(currentLanguage); }}
              trackColor={{ false: "#E5E7EB", true: "#6EE7B7" }}
              thumbColor={settings.studyReminderEnabled ? "#10B981" : "#9CA3AF"}
            />
          </View>

          {/* Heure rappel */}
          {settings.enabled && settings.studyReminderEnabled && (
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
                alignItems: "center", padding: 16,
                borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
                backgroundColor: "#F8F9FA",
              }}
            >
              <View style={{
                width: 36, height: 36, borderRadius: 10, backgroundColor: "#EEF2FF",
                alignItems: "center", justifyContent: "center",
                marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
              }}>
                <Ionicons name="time-outline" size={18} color="#6366F1" />
              </View>
              <Text style={{ fontSize: 14, color: "#374151", flex: 1, textAlign: isRTL ? "right" : "left" }}>
                {getLabel("Heure du rappel", "Reminder time", "وقت التذكير")}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#6366F1" }}>
                {String(settings.studyReminderHour).padStart(2, "0")}:{String(settings.studyReminderMinute).padStart(2, "0")}
              </Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color="#D1D5DB" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}

          {/* Alertes plan */}
          <View style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center", padding: 16,
            borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
            opacity: settings.enabled ? 1 : 0.4,
          }}>
            <View style={{
              width: 36, height: 36, borderRadius: 10, backgroundColor: "#FEF3C715",
              alignItems: "center", justifyContent: "center",
              marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
            }}>
              <Ionicons name="calendar-outline" size={18} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: "#374151", textAlign: isRTL ? "right" : "left" }}>
                {getLabel("Alertes plan d'étude", "Study plan alerts", "تنبيهات خطة الدراسة")}
              </Text>
              <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2, textAlign: isRTL ? "right" : "left" }}>
                {getLabel("Rappel J-1 avant l'examen", "Reminder 1 day before exam", "تذكير قبل الامتحان بيوم")}
              </Text>
            </View>
            <Switch
              value={settings.planAlertsEnabled}
              onValueChange={() => { if (!settings.enabled) return; togglePlanAlerts(currentLanguage); }}
              trackColor={{ false: "#E5E7EB", true: "#FCD34D" }}
              thumbColor={settings.planAlertsEnabled ? "#F59E0B" : "#9CA3AF"}
            />
          </View>

          {/* Test notification */}
          <TouchableOpacity
            onPress={() => sendTestNotification(currentLanguage)}
            disabled={!settings.enabled || !hasPermission}
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center", padding: 16,
              opacity: settings.enabled && hasPermission ? 1 : 0.4,
            }}
          >
            <View style={{
              width: 36, height: 36, borderRadius: 10, backgroundColor: "#F3F4F6",
              alignItems: "center", justifyContent: "center",
              marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
            }}>
              <Ionicons name="paper-plane-outline" size={18} color="#6B7280" />
            </View>
            <Text style={{ fontSize: 14, color: "#374151", flex: 1, textAlign: isRTL ? "right" : "left" }}>
              {getLabel("Envoyer une notification test", "Send test notification", "إرسال إشعار تجريبي")}
            </Text>
            <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setShowTimePicker(false);
            if (date) setReminderTime(date.getHours(), date.getMinutes(), currentLanguage);
          }}
        />
      )}
    </SafeAreaView>
  );
}