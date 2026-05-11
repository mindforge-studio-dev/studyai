// app/privacy.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "../store/languageStore";

export default function PrivacyScreen() {
  const { currentLanguage } = useLanguageStore();
  const isRTL = currentLanguage === "ar";

  const getLabel = (fr: string, en: string, ar: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "en" ? en : fr;

  const sections = [
    {
      title: getLabel("1. Données collectées", "1. Data Collected", "1. البيانات المجمعة"),
      content: getLabel(
        "StudyAI collecte les informations suivantes :\n• Nom et prénom\n• Adresse email\n• Date de naissance\n• Contenu généré (quiz, résumés, flashcards, plans)\n• Données d'utilisation (nombre de requêtes, fichiers importés)",
        "StudyAI collects the following information:\n• First and last name\n• Email address\n• Date of birth\n• Generated content (quizzes, summaries, flashcards, plans)\n• Usage data (number of requests, imported files)",
        "يجمع StudyAI المعلومات التالية:\n• الاسم الأول واسم العائلة\n• عنوان البريد الإلكتروني\n• تاريخ الميلاد\n• المحتوى المُنشأ (اختبارات، ملخصات، بطاقات، خطط)\n• بيانات الاستخدام (عدد الطلبات، الملفات المستوردة)"
      ),
    },
    {
      title: getLabel("2. Utilisation des données", "2. Use of Data", "2. استخدام البيانات"),
      content: getLabel(
        "Vos données sont utilisées pour :\n• Fournir et améliorer nos services\n• Personnaliser votre expérience\n• Gérer votre compte et votre abonnement\n• Envoyer des notifications importantes\n• Assurer la sécurité de la plateforme",
        "Your data is used to:\n• Provide and improve our services\n• Personalize your experience\n• Manage your account and subscription\n• Send important notifications\n• Ensure platform security",
        "تُستخدم بياناتك من أجل:\n• تقديم خدماتنا وتحسينها\n• تخصيص تجربتك\n• إدارة حسابك واشتراكك\n• إرسال إشعارات مهمة\n• ضمان أمان المنصة"
      ),
    },
    {
      title: getLabel("3. Partage des données", "3. Data Sharing", "3. مشاركة البيانات"),
      content: getLabel(
        "StudyAI ne vend jamais vos données personnelles. Nous pouvons partager vos données uniquement avec :\n• Firebase (Google) pour le stockage et l'authentification\n• OpenAI pour la génération de contenu IA\n• Ces partenaires sont soumis à des politiques strictes de confidentialité.",
        "StudyAI never sells your personal data. We may share your data only with:\n• Firebase (Google) for storage and authentication\n• OpenAI for AI content generation\n• These partners are subject to strict privacy policies.",
        "لا يبيع StudyAI بياناتك الشخصية أبدًا. قد نشارك بياناتك فقط مع:\n• Firebase (Google) للتخزين والمصادقة\n• OpenAI لتوليد محتوى الذكاء الاصطناعي\n• هؤلاء الشركاء خاضعون لسياسات خصوصية صارمة."
      ),
    },
    {
      title: getLabel("4. Protection des mineurs", "4. Protection of Minors", "4. حماية القاصرين"),
      content: getLabel(
        "Pour les utilisateurs de moins de 13 ans, nous exigeons le consentement parental avant l'activation du compte. Les données des mineurs sont traitées avec une attention particulière et ne sont jamais utilisées à des fins commerciales.",
        "For users under 13 years old, we require parental consent before account activation. Minors' data is handled with special care and is never used for commercial purposes.",
        "بالنسبة للمستخدمين دون سن 13 عامًا، نطلب موافقة أحد الوالدين قبل تفعيل الحساب. يتم التعامل مع بيانات القاصرين بعناية خاصة ولا تُستخدم أبدًا لأغراض تجارية."
      ),
    },
    {
      title: getLabel("5. Sécurité", "5. Security", "5. الأمان"),
      content: getLabel(
        "Nous utilisons des mesures de sécurité standard pour protéger vos données :\n• Chiffrement SSL/TLS\n• Authentification Firebase\n• Règles Firestore strictes\n• Suppression automatique des comptes non vérifiés après 24h",
        "We use standard security measures to protect your data:\n• SSL/TLS encryption\n• Firebase authentication\n• Strict Firestore rules\n• Automatic deletion of unverified accounts after 24 hours",
        "نستخدم تدابير أمنية قياسية لحماية بياناتك:\n• تشفير SSL/TLS\n• مصادقة Firebase\n• قواعد Firestore صارمة\n• حذف تلقائي للحسابات غير المُتحقق منها بعد 24 ساعة"
      ),
    },
    {
      title: getLabel("6. Vos droits", "6. Your Rights", "6. حقوقك"),
      content: getLabel(
        "Vous avez le droit de :\n• Accéder à vos données personnelles\n• Modifier vos informations depuis l'écran Profil\n• Supprimer votre compte et toutes vos données\n• Contacter notre équipe pour toute demande",
        "You have the right to:\n• Access your personal data\n• Modify your information from the Profile screen\n• Delete your account and all your data\n• Contact our team for any request",
        "لديك الحق في:\n• الوصول إلى بياناتك الشخصية\n• تعديل معلوماتك من شاشة الملف الشخصي\n• حذف حسابك وجميع بياناتك\n• التواصل مع فريقنا لأي طلب"
      ),
    },
    {
      title: getLabel("7. Contact", "7. Contact", "7. التواصل"),
      content: getLabel(
        "Pour toute question concernant cette politique :\nmindforge.studio.dev@gmail.com",
        "For any questions regarding this policy:\nmindforge.studio.dev@gmail.com",
        "لأي أسئلة تتعلق بهذه السياسة:\nmindforge.studio.dev@gmail.com"
      ),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

        {/* Header */}
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }}
          >
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827" }}>
              {getLabel("Politique de confidentialité", "Privacy Policy", "سياسة الخصوصية")}
            </Text>
            <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
              {getLabel("Dernière mise à jour : Mai 2025", "Last updated: May 2025", "آخر تحديث: مايو 2025")}
            </Text>
          </View>
        </View>

        {/* Intro */}
        <View style={{
          backgroundColor: "#EEF2FF", borderRadius: 12, padding: 14, marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 13, color: "#3730A3", lineHeight: 20,
            textAlign: isRTL ? "right" : "left",
          }}>
            {getLabel(
              "Chez StudyAI, nous respectons votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles.",
              "At StudyAI, we respect your privacy. This policy explains how we collect, use, and protect your personal data.",
              "في StudyAI، نحترم خصوصيتك. توضح هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها وحمايتها."
            )}
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#FFFFFF", borderRadius: 14,
              padding: 16, marginBottom: 12,
              borderWidth: 1, borderColor: "#F3F4F6",
            }}
          >
            <Text style={{
              fontSize: 14, fontWeight: "700", color: "#111827",
              marginBottom: 8, textAlign: isRTL ? "right" : "left",
            }}>
              {section.title}
            </Text>
            <Text style={{
              fontSize: 13, color: "#374151", lineHeight: 22,
              textAlign: isRTL ? "right" : "left",
            }}>
              {section.content}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={{ fontSize: 11, color: "#D1D5DB" }}>
            © 2025 StudyAI — MindForge Studio
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}