// app/personal-info.tsx
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { useAuthStore } from "../store/authStore";
import { useLanguageStore } from "../store/languageStore";

export default function PersonalInfoScreen() {
  const { user, setFirstName: setStoreFirstName } = useAuthStore();
  const { currentLanguage } = useLanguageStore();
  const isRTL = currentLanguage === "ar";
  const db = getFirestore(getApp());

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editAge, setEditAge] = useState("");

  const getLabel = (fr: string, en: string, ar: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "en" ? en : fr;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setAge(data.age || null);
      }
    } catch (e) {
      console.log("loadProfile error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditAge(age?.toString() || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editFirstName.trim() || !editLastName.trim()) {
      Alert.alert("", getLabel("Prénom et nom requis.", "First and last name required.", "الاسم الأول واسم العائلة مطلوبان."));
      return;
    }
    const ageNum = parseInt(editAge);
    if (editAge && (isNaN(ageNum) || ageNum < 1 || ageNum > 120)) {
      Alert.alert("", getLabel("Âge invalide.", "Invalid age.", "عمر غير صالح."));
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user!.uid), {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        age: ageNum || age,
      });
      setFirstName(editFirstName.trim());
      setStoreFirstName(editFirstName.trim());
      setLastName(editLastName.trim());
      if (ageNum) setAge(ageNum);
      setEditing(false);
      Alert.alert("✅", getLabel("Profil mis à jour !", "Profile updated!", "تم تحديث الملف الشخصي!"));
    } catch (e: any) {
      Alert.alert("", e.message || getLabel("Erreur lors de la mise à jour.", "Update failed.", "فشل التحديث."));
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { icon: "person-outline", label: getLabel("Prénom", "First name", "الاسم الأول"), value: firstName || "—" },
    { icon: "people-outline", label: getLabel("Nom", "Last name", "اسم العائلة"), value: lastName || "—" },
    { icon: "calendar-number-outline", label: getLabel("Âge", "Age", "العمر"), value: age ? `${age} ${getLabel("ans", "years", "سنة")}` : "—" },
    { icon: "mail-outline", label: "Email", value: user?.email || "—", readonly: true },
    { icon: "shield-checkmark-outline", label: getLabel("Statut", "Status", "الحالة"), value: getLabel("Compte vérifié ✓", "Verified account ✓", "حساب موثق ✓"), color: "#10B981" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* Header */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#374151" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {getLabel("Informations personnelles", "Personal Information", "المعلومات الشخصية")}
            </Text>
          </View>
          {!editing && !loading && (
            <TouchableOpacity onPress={handleEdit} style={{ backgroundColor: "#EEF2FF", borderRadius: 10, padding: 8 }}>
              <Ionicons name="create-outline" size={20} color="#6366F1" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 40 }} />
        ) : editing ? (
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#F3F4F6", marginBottom: 16 }}>
            {[
              { label: getLabel("Prénom", "First name", "الاسم الأول"), value: editFirstName, setter: setEditFirstName, capitalize: "words" as const },
              { label: getLabel("Nom", "Last name", "اسم العائلة"), value: editLastName, setter: setEditLastName, capitalize: "words" as const },
              { label: getLabel("Âge", "Age", "العمر"), value: editAge, setter: setEditAge, keyboard: "numeric" as const },
            ].map((field, index) => (
              <View key={index} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, textAlign: isRTL ? "right" : "left" }}>
                  {field.label}
                </Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.setter}
                  autoCapitalize={field.capitalize || "none"}
                  keyboardType={field.keyboard || "default"}
                  textAlign={isRTL ? "right" : "left"}
                  style={{
                    backgroundColor: "#F8F9FA", borderWidth: 1, borderColor: "#E5E7EB",
                    borderRadius: 10, padding: 12, fontSize: 15, color: "#111827",
                  }}
                />
              </View>
            ))}

            <Text style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, textAlign: isRTL ? "right" : "left" }}>
              Email — <Text style={{ color: "#D1D5DB" }}>{getLabel("Non modifiable", "Read only", "غير قابل للتعديل")}</Text>
            </Text>
            <View style={{ backgroundColor: "#F3F4F6", borderRadius: 10, padding: 12, marginBottom: 20 }}>
              <Text style={{ fontSize: 15, color: "#9CA3AF" }}>{user?.email}</Text>
            </View>

            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setEditing(false)}
                style={{ flex: 1, borderRadius: 10, padding: 12, alignItems: "center", backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB" }}
              >
                <Text style={{ fontWeight: "600", color: "#374151" }}>{getLabel("Annuler", "Cancel", "إلغاء")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                style={{ flex: 1, borderRadius: 10, padding: 12, alignItems: "center", backgroundColor: saving ? "#A5B4FC" : "#6366F1" }}
              >
                {saving ? <ActivityIndicator size="small" color="#FFF" /> : (
                  <Text style={{ fontWeight: "600", color: "#FFF" }}>{getLabel("Enregistrer", "Save", "حفظ")}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#F3F4F6", marginBottom: 16, overflow: "hidden" }}>
            {fields.map((field, index) => (
              <View
                key={index}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center", padding: 16,
                  borderBottomWidth: index < fields.length - 1 ? 1 : 0,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: field.color ? "#10B98115" : "#EEF2FF",
                  alignItems: "center", justifyContent: "center",
                  marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
                }}>
                  <Ionicons name={field.icon as any} size={18} color={field.color || "#6366F1"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2, textAlign: isRTL ? "right" : "left" }}>
                    {field.label}
                  </Text>
                  <Text style={{ fontSize: 14, color: field.color || "#374151", fontWeight: "500", textAlign: isRTL ? "right" : "left" }}>
                    {field.value}
                  </Text>
                </View>
                {field.readonly && (
                  <View style={{ backgroundColor: "#F3F4F6", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>{getLabel("Non modifiable", "Read only", "غير قابل للتعديل")}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Modifier mot de passe */}
        <TouchableOpacity
          onPress={() => router.push("/changePassword" as any)}
          style={{
            backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16,
            flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center",
            borderWidth: 1, borderColor: "#F3F4F6",
          }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 10, backgroundColor: "#EEF2FF",
            alignItems: "center", justifyContent: "center",
            marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0,
          }}>
            <Ionicons name="lock-closed-outline" size={18} color="#6366F1" />
          </View>
          <Text style={{ flex: 1, fontSize: 14, color: "#374151", fontWeight: "500", textAlign: isRTL ? "right" : "left" }}>
            {getLabel("Modifier le mot de passe", "Change password", "تغيير كلمة المرور")}
          </Text>
          <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color="#D1D5DB" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}