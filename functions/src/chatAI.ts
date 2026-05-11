// functions/src/chatAI.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import OpenAI from "openai";

const openaiKey = defineSecret("OPENAI_API_KEY");

export const chatAI = onCall(
  { region: "us-central1", secrets: [openaiKey], invoker: "public" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Connexion requise.");
    }

    const { message, courseName, history, language = "fr" } = request.data;

    if (!message || message.trim().length === 0) {
      throw new HttpsError("invalid-argument", "Message requis.");
    }
    if (!courseName || courseName.trim().length === 0) {
      throw new HttpsError("invalid-argument", "Cours requis.");
    }

    const subjectBoundaries =
      language === "ar"
        ? `
- الرياضيات: الجبر، الهندسة، التحليل، الإحصاء، المثلثات، التفاضل والتكامل، المصفوفات. مرفوض: الكيمياء، الفيزياء، الأحياء.
- الفيزياء: الميكانيكا، الكهرباء، الضوء، الحرارة، الموجات. مرفوض: المعادلات الكيميائية، الأحياء.
- الكيمياء: العناصر، المركبات، التفاعلات، الجدول الدوري. مرفوض: الفيزياء البحتة، الأحياء.
- التاريخ: الأحداث التاريخية، الحضارات، الحروب، السياسة التاريخية. مرفوض: الجغرافيا، العلوم.
- الجغرافيا: الخرائط، المناخ، التضاريس، السكان. مرفوض: التاريخ، العلوم.
- الأحياء: الخلية، الجينات، التشريح، النظم البيئية. مرفوض: الكيمياء البحتة، الفيزياء.
- الإعلام الآلي: البرمجة، الخوارزميات، قواعد البيانات، الشبكات. مرفوض: الرياضيات البحتة.
- الأدب: النصوص، الشعر، التحليل الأدبي، البلاغة. مرفوض: التاريخ، العلوم.
- الفلسفة: المنطق، الأخلاق، الميتافيزيقيا، نظرية المعرفة. مرفوض: العلوم، التاريخ.
- الإنجليزية: القواعد، المفردات، القراءة، الكتابة باللغة الإنجليزية. مرفوض: مواد أخرى.`

        : language === "en"
        ? `
- Mathematics: algebra, geometry, analysis, statistics, trigonometry, calculus, matrices. REJECT: chemistry equations, biology, pure history.
- Physics: mechanics, electricity, light, heat, waves. REJECT: chemical equations, biology.
- Chemistry: elements, compounds, reactions, periodic table. REJECT: pure physics formulas, biology.
- History: historical events, civilizations, wars, political history. REJECT: geography, sciences.
- Geography: maps, climate, landforms, population. REJECT: history, sciences.
- Biology: cell, genetics, anatomy, ecosystems. REJECT: pure chemistry, physics.
- Computer Science: programming, algorithms, databases, networks. REJECT: pure mathematics.
- Literature: texts, poetry, literary analysis, rhetoric. REJECT: history, sciences.
- Philosophy: logic, ethics, metaphysics, epistemology. REJECT: sciences, history.
- English: grammar, vocabulary, reading, writing in English. REJECT: other subjects.`

        : `
- Mathématiques: algèbre, géométrie, analyse, statistiques, trigonométrie, intégrales, matrices, suites, probabilités, vecteurs, fonctions, limites, dérivées. REFUSER: équations chimiques, biologie, histoire pure.
- Physique: mécanique, électricité, optique, thermodynamique, ondes, cinématique, dynamique. REFUSER: équations chimiques, biologie.
- Chimie: éléments, composés, réactions, tableau périodique, liaisons, acides-bases, oxydoréduction. REFUSER: formules physiques pures, biologie.
- Histoire: événements historiques, civilisations, guerres, politique historique, dates, personnages historiques. REFUSER: géographie physique, sciences.
- Géographie: cartes, climat, relief, population, pays, continents, ressources naturelles. REFUSER: histoire pure, sciences.
- Biologie: cellule, génétique, anatomie, écosystèmes, évolution, photosynthèse, respiration. REFUSER: chimie pure, physique pure.
- Informatique: programmation, algorithmes, bases de données, réseaux, systèmes d'exploitation, HTML, CSS, Python, Java. REFUSER: mathématiques pures hors contexte.
- Littérature: textes, poésie, analyse littéraire, rhétorique, auteurs, œuvres, figures de style. REFUSER: histoire, sciences.
- Philosophie: logique, éthique, métaphysique, épistémologie, auteurs philosophiques, courants. REFUSER: sciences, histoire pure.
- Anglais: grammaire anglaise, vocabulaire, lecture, rédaction, conjugaison en anglais. REFUSER: autres matières.`;

    const systemPrompt =
      language === "ar"
        ? `أنت مساعد تعليمي متخصص حصرياً في مادة "${courseName}".

حدود كل مادة:
${subjectBoundaries}

قواعد صارمة:
1. أجب فقط على الأسئلة المتعلقة مباشرة بـ "${courseName}".
2. تحقق من حدود المادة أعلاه قبل الإجابة.
3. إذا كان السؤال خارج نطاق "${courseName}"، أعد هذا JSON فقط:
   {"answer": null, "rejected": true, "reason": "هذا السؤال يتعلق بمادة أخرى، وليس بـ ${courseName}."}
4. إذا كان السؤال ضمن نطاق "${courseName}"، أعد:
   {"answer": "إجابتك الكاملة هنا", "rejected": false}
5. لا تكتب أبداً خارج هذا JSON.`

        : language === "en"
        ? `You are an educational assistant specialized EXCLUSIVELY in "${courseName}".

Subject boundaries:
${subjectBoundaries}

Strict rules:
1. Answer ONLY questions directly related to "${courseName}".
2. Check the subject boundaries above before answering.
3. If the question is outside "${courseName}", return ONLY this JSON:
   {"answer": null, "rejected": true, "reason": "This question belongs to another subject, not ${courseName}."}
4. If the question is within "${courseName}", return:
   {"answer": "your complete answer here", "rejected": false}
5. NEVER write anything outside this JSON.`

        : `Tu es un assistant pédagogique spécialisé EXCLUSIVEMENT dans "${courseName}".

Limites de chaque matière :
${subjectBoundaries}

Règles strictes :
1. Tu réponds UNIQUEMENT aux questions directement liées à "${courseName}".
2. Vérifie les limites de la matière ci-dessus avant de répondre.
3. Si la question est en dehors de "${courseName}", retourne UNIQUEMENT ce JSON :
   {"answer": null, "rejected": true, "reason": "Cette question appartient à une autre matière, pas à ${courseName}."}
4. Si la question est dans le domaine de "${courseName}", retourne :
   {"answer": "ta réponse complète ici", "rejected": false}
5. N'écris JAMAIS rien en dehors de ce JSON.
6. Pour les formules : ∫f(x)dx, a/b, √x, Σ, x², π`;

    const openai = new OpenAI({ apiKey: openaiKey.value() });

    const historyMessages = (history || []).slice(-10).map((msg: any) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...historyMessages,
        { role: "user", content: message },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message.content || "{}";

    try {
      const parsed = JSON.parse(raw);
      if (parsed.answer && typeof parsed.answer === "string") {
        parsed.answer = parsed.answer
          .replace(/```json[\s\S]*?```/g, "")
          .replace(/```[\s\S]*?```/g, "")
          .trim();
      }
      return parsed;
    } catch {
      return { answer: raw, rejected: false };
    }
  }
);