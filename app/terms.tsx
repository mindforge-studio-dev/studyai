// app/terms.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLanguageStore } from "../store/languageStore";

export default function TermsScreen() {
  const { currentLanguage } = useLanguageStore();
  const isRTL = currentLanguage === "ar";

  const getLabel = (fr: string, en: string, ar: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "en" ? en : fr;

  const sections = [
    {
      title: getLabel("1. Acceptation des conditions", "1. Acceptance of Terms", "1. قبول الشروط"),
      content: getLabel(
        "En utilisant StudyAI, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.",
        "By using StudyAI, you agree to these terms of service. If you do not agree to these terms, please do not use the application.",
        "باستخدام StudyAI، فإنك توافق على شروط الاستخدام هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام التطبيق."
      ),
    },
    {
      title: getLabel("2. Description du service", "2. Service Description", "2. وصف الخدمة"),
      content: getLabel(
        "StudyAI est une application d'aide à l'étude propulsée par l'intelligence artificielle. Elle propose :\n• Génération de quiz, flashcards et résumés\n• Plans d'étude personnalisés\n• Chat avec un assistant IA\n• Explications et résolution de problèmes",
        "StudyAI is an AI-powered study assistance application. It offers:\n• Generation of quizzes, flashcards and summaries\n• Personalized study plans\n• Chat with an AI assistant\n• Explanations and problem solving",
        "StudyAI هو تطبيق مساعدة في الدراسة مدعوم بالذكاء الاصطناعي. يقدم:\n• توليد الاختبارات والبطاقات التعليمية والملخصات\n• خطط دراسية مخصصة\n• محادثة مع مساعد ذكاء اصطناعي\n• شروحات وحل المسائل"
      ),
    },
    {
      title: getLabel("3. Compte utilisateur", "3. User Account", "3. حساب المستخدم"),
      content: getLabel(
        "Pour utiliser StudyAI, vous devez :\n• Créer un compte avec des informations exactes\n• Maintenir la confidentialité de votre mot de passe\n• Être responsable de toute activité sur votre compte\n• Avoir au moins 13 ans ou obtenir le consentement parental",
        "To use StudyAI, you must:\n• Create an account with accurate information\n• Maintain the confidentiality of your password\n• Be responsible for all activity on your account\n• Be at least 13 years old or obtain parental consent",
        "لاستخدام StudyAI، يجب عليك:\n• إنشاء حساب بمعلومات دقيقة\n• الحفاظ على سرية كلمة المرور\n• تحمل المسؤولية عن جميع الأنشطة على حسابك\n• أن يكون عمرك 13 عامًا على الأقل أو الحصول على موافقة الوالدين"
      ),
    },
    {
      title: getLabel("4. Utilisation acceptable", "4. Acceptable Use", "4. الاستخدام المقبول"),
      content: getLabel(
        "Vous vous engagez à ne pas :\n• Utiliser l'application à des fins illégales\n• Tenter de contourner les limites d'utilisation\n• Partager votre compte avec d'autres personnes\n• Utiliser l'IA pour générer du contenu nuisible ou trompeur\n• Copier ou redistribuer le contenu de l'application",
        "You agree not to:\n• Use the application for illegal purposes\n• Attempt to circumvent usage limits\n• Share your account with others\n• Use AI to generate harmful or misleading content\n• Copy or redistribute application content",
        "توافق على عدم:\n• استخدام التطبيق لأغراض غير قانونية\n• محاولة التحايل على حدود الاستخدام\n• مشاركة حسابك مع الآخرين\n• استخدام الذكاء الاصطناعي لتوليد محتوى ضار أو مضلل\n• نسخ محتوى التطبيق أو إعادة توزيعه"
      ),
    },
    {
      title: getLabel("5. Limites d'utilisation", "5. Usage Limits", "5. حدود الاستخدام"),
      content: getLabel(
        "Plan gratuit : 5 requêtes IA et 1 fichier par jour.\nPlan Premium : 50 requêtes IA et 10 fichiers par jour.\nCes limites sont remises à zéro chaque jour. StudyAI se réserve le droit de modifier ces limites à tout moment.",
        "Free plan: 5 AI requests and 1 file per day.\nPremium plan: 50 AI requests and 10 files per day.\nThese limits reset daily. StudyAI reserves the right to modify these limits at any time.",
        "الخطة المجانية: 5 طلبات ذكاء اصطناعي وملف واحد يوميًا.\nالخطة المدفوعة: 50 طلبًا و10 ملفات يوميًا.\nتُعاد هذه الحدود يوميًا. يحتفظ StudyAI بحق تعديل هذه الحدود في أي وقت."
      ),
    },
    {
      title: getLabel("6. Propriété intellectuelle", "6. Intellectual Property", "6. الملكية الفكرية"),
      content: getLabel(
        "L'application StudyAI, son interface et son code source sont la propriété exclusive de MindForge Studio. Le contenu généré par l'IA appartient à l'utilisateur qui l'a créé, sous réserve des conditions d'utilisation d'OpenAI.",
        "The StudyAI application, its interface and source code are the exclusive property of MindForge Studio. AI-generated content belongs to the user who created it, subject to OpenAI's terms of use.",
        "تطبيق StudyAI وواجهته وشفرته المصدرية هي ملكية حصرية لـ MindForge Studio. المحتوى الذي ينشئه الذكاء الاصطناعي يعود للمستخدم الذي أنشأه، وفقًا لشروط استخدام OpenAI."
      ),
    },
    {
      title: getLabel("7. Résiliation", "7. Termination", "7. الإنهاء"),
      content: getLabel(
        "StudyAI se réserve le droit de suspendre ou supprimer votre compte en cas de violation des présentes conditions. Vous pouvez supprimer votre compte à tout moment depuis l'écran Profil.",
        "StudyAI reserves the right to suspend or delete your account in case of violation of these terms. You can delete your account at any time from the Profile screen.",
        "يحتفظ StudyAI بحق تعليق حسابك أو حذفه في حالة انتهاك هذه الشروط. يمكنك حذف حسابك في أي وقت من شاشة الملف الشخصي."
      ),
    },
    {
      title: getLabel("8. Contact", "8. Contact", "8. التواصل"),
      content: getLabel(
        "Pour toute question concernant ces conditions :\nmindforge.studio.dev@gmail.com",
        "For any questions regarding these terms:\nmindforge.studio.dev@gmail.com",
        "لأي أسئلة تتعلق بهذه الشروط:\nmindforge.studio.dev@gmail.com"
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
              {getLabel("Conditions d'utilisation", "Terms of Service", "شروط الاستخدام")}
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
              "Veuillez lire attentivement ces conditions avant d'utiliser StudyAI. En utilisant notre application, vous acceptez d'être lié par ces conditions.",
              "Please read these terms carefully before using StudyAI. By using our application, you agree to be bound by these terms.",
              "يرجى قراءة هذه الشروط بعناية قبل استخدام StudyAI. باستخدام تطبيقنا، فإنك توافق على الالتزام بهذه الشروط."
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