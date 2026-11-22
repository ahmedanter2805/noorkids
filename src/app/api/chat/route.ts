import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Curated child-safe Islamic knowledge base for instant offline/fallback responses
const ISLAMIC_KNOWLEDGE_BASE: Array<{
  keywords: string[];
  reply: string;
}> = [
  {
    keywords: ["wudu", "wash", "ablution", "how to make wudu", "وضوء", "الوضوء"],
    reply: `Assalamu Alaikum, young star! 🌟
Making Wudu (الْوُضُوء) is our sparkling clean-up before talking to Allah! Here are the easy steps:
1. Say **Bismillah** (بِسْمِ اللَّهِ) and wash your hands 3 times.
2. Rinse your mouth 3 times (**Madmadah** - الْمَضْمَضَة).
3. Sniff water gently into your nose and blow it out 3 times (**Istinshaq** - الِاسْتِنْشَاق).
4. Wash your whole face 3 times.
5. Wash both arms up to your elbows 3 times (start with right arm!).
6. Wipe moist hands over your head and ears once.
7. Wash both feet up to the ankles 3 times (right foot first!).
Now you are shining with light (Noor) and ready for prayer! 💧✨`,
  },
  {
    keywords: ["sleep", "sleeping", "bed", "dua before sleep", "نوم", "دعاء النوم"],
    reply: `Here is the sweet Dua the Prophet ﷺ recited before sleeping:
📖 In Arabic: **بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا**
🗣️ Transliteration: *Bismika Allahumma amootu wa ahya.*
💖 Meaning: "In Your name, O Allah, I die and I live."
Tip: Lie down on your right side, dust your bed three times, and ask Allah to send guardian angels to watch over your dreams! 🌙⭐`,
  },
  {
    keywords: ["eat", "eating", "food", "dua before eating", "طعام", "الأكل"],
    reply: `Before taking your first delicious bite, say:
📖 In Arabic: **بِسْمِ اللَّهِ** (*Bismillah* - "In the name of Allah").
If you ever forget and remember in the middle of eating, don't worry! You can say:
📖 **بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ** (*Bismillahi awwalahu wa aakhirah* - "In the name of Allah at its beginning and end").
And always eat with your right hand! 🍎🤲`,
  },
  {
    keywords: ["sadaqah", "charity", "give", "money", "صدقة", "الصدقة"],
    reply: `Sadaqah (الصَّدَقَة) is giving kindness and sharing blessings! 💖
Did you know that you don't even need money to give Sadaqah?
Our beloved Prophet Muhammad ﷺ taught us:
✨ **تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ**
*(Tabassumuka fee wajhi akheeka laka sadaqah)*
"Smiling in the face of your brother or sister is a Sadaqah!"
Helping your parents with chores, picking up a toy from the floor so no one trips, and sharing your pencils are all wonderful Sadaqah! 🎁`,
  },
  {
    keywords: ["ramadan", "fasting", "sawm", "iftar", "suhoor", "رمضان", "الصيام"],
    reply: `Ramadan Mubarak! 🌙
Ramadan is the holiest month where the Quran was revealed. In Ramadan:
• **Sawm (الصَّوْم):** Fasting from Fajr to Maghrib trains our patience (Sabr) and reminds us of those who are hungry.
• **Suhoor (السُّحُور):** The yummy morning meal before sunrise.
• **Iftar (الإِفْطَار):** The happy meal at sunset, usually started with dates and water!
At Iftar, say:
**ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ**
*(Dhahaba adh-Dhama'u wabtallat al-'urooq wa thabata al-ajr in sha Allah)* 🤲✨`,
  },
  {
    keywords: ["prayer", "salah", "prayers", "5 prayers", "fajr", "dhuhr", "asr", "maghrib", "isha", "صلاة", "الصلوات"],
    reply: `Salah (الصَّلَاة) is our direct phone call to Allah five times a day! 📞❤️
Here are the 5 prayers:
1. 🌅 **Fajr (الفجر):** 2 Rak'ahs at dawn.
2. ☀️ **Dhuhr (الظهر):** 4 Rak'ahs at midday.
3. 🌤️ **Asr (العصر):** 4 Rak'ahs in the afternoon.
4. 🌇 **Maghrib (المغرب):** 3 Rak'ahs right after sunset.
5. 🌌 **Isha (العشاء):** 4 Rak'ahs at night.
Every time we pray, our sins are washed away like bathing in a clear stream! 🌊`,
  },
  {
    keywords: ["quran", "fatihah", "surah", "book", "قرآن", "الفاتحة"],
    reply: `The Holy Quran (الْقُرْآنُ الْكَرِيمُ) is the direct, miraculous word of Allah given to Prophet Muhammad ﷺ through Angel Jibreel! 📖
It is divided into 114 Surahs. The first one you learn is **Surah Al-Fatihah** (The Opening), which begins:
**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ**
Reciting even one single letter of the Quran gives you 10 good deeds (Hasanat)! Keep reciting every day! ⭐`,
  },
  {
    keywords: ["prophet", "muhammad", "messenger", "pbuh", "محمد", "الرسول"],
    reply: `Prophet Muhammad ﷺ (Peace and blessings be upon him) is our greatest role model! 🌸
He was known as **As-Sadiq Al-Amin** (The Truthful and Trustworthy). He loved children, smiled often, was merciful to animals, and never spoke ill of anyone.
Whenever you hear his blessed name, say:
**صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ**
*(Sallallahu 'alayhi wa sallam)* 💖`,
  },
  {
    keywords: ["parents", "mom", "dad", "mother", "father", "والدين", "أمي", "أبي"],
    reply: `In Islam, loving and honoring your parents is called **Birr Al-Walidayn** (بِرُّ الْوَالِدَيْنِ)! 👑
Allah tells us in the Quran never to say even 'Uff' (expressing irritation) to them.
Say this beautiful Dua for them every day:
**رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا**
*(Rabbi irhamhuma kama rabbayani sagheera)*
"My Lord, have mercy upon them as they brought me up when I was small." ❤️`,
  },
  {
    keywords: ["who made", "allah", "god", "who created", "الله", "من خلق"],
    reply: `Allah (اللَّهُ) is our loving Creator! He made the twinkling stars, the oceans, the cute animals, and you!
He has 99 Most Beautiful Names (Asma'ul Husna), like:
• **Ar-Rahman (الرَّحْمَٰنُ):** The Most Merciful
• **Al-Khaliq (الْخَالِقُ):** The Creator
• **As-Sami' (السَّمِيعُ):** The All-Hearing who always hears your whisper Duas! 🌟`,
  },
];

export async function POST(req: NextRequest) {
  try {
    const { messages, userMessage } = await req.json();
    const prompt = (userMessage || messages?.[messages.length - 1]?.content || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { reply: "Assalamu Alaikum! What would you like to learn today? Ask me about Wudu, Salah, Ramadan, or Prophet stories! 🌟" },
        { status: 200 }
      );
    }

    const lowerPrompt = prompt.toLowerCase();

    // Check knowledge base
    for (const item of ISLAMIC_KNOWLEDGE_BASE) {
      for (const kw of item.keywords) {
        if (lowerPrompt.includes(kw.toLowerCase())) {
          return NextResponse.json({ reply: item.reply });
        }
      }
    }

    // Friendly, encouraging child-safe default response
    const defaultChildSafeReply = `Assalamu Alaikum wa Rahmatullah! 🌸
That's such a thoughtful question! In Islam, we are encouraged to always ask and seek knowledge (*Talab al-'Ilm* - طَلَبُ الْعِلْمِ).

Allah loves curious young learners like you! Here is a great tip:
Whenever you embark on learning or doing something good, start by saying:
**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**
*(In the name of Allah, the Most Merciful, the Especially Merciful)*

You can also ask me about:
1. 💧 "How do I make Wudu?"
2. 🕌 "What are the 5 daily prayers?"
3. 🌙 "Tell me about Ramadan and fasting"
4. 🤲 "What is the Dua before eating or sleeping?"
5. 🚢 "Tell me the story of Prophet Nuh's ark"

Keep shining and collecting good deeds! 🌟`;

    return NextResponse.json({ reply: defaultChildSafeReply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Assalamu Alaikum! NoorBot is always here with you. Try asking about Wudu, Salah, or Duas! 🌟",
      },
      { status: 200 }
    );
  }
}
