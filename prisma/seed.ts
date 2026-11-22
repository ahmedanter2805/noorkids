import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting NoorKids database seed...");

  // Clean existing records if any
  await prisma.childBadge.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.quizResult.deleteMany({});
  await prisma.progress.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.child.deleteMany({});
  await prisma.parent.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Creating default users with hashed passwords...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const parentPassword = await bcrypt.hash("parent123", 10);
  const omarPassword = await bcrypt.hash("omar123", 10);
  const saraPassword = await bcrypt.hash("sara123", 10);

  // 1. Admin
  const adminUser = await prisma.user.create({
    data: {
      fullName: "Ustadh Ahmad (Platform Admin)",
      email: "admin@noorkids.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      adminProfile: {
        create: {},
      },
    },
  });

  // 2. Parent
  const parentUser = await prisma.user.create({
    data: {
      fullName: "Maryam & Kareem (Parent)",
      email: "parent@noorkids.com",
      passwordHash: parentPassword,
      role: "PARENT",
      parentProfile: {
        create: {
          phoneNumber: "+1 (555) 234-5678",
        },
      },
    },
    include: {
      parentProfile: true,
    },
  });

  const parentId = parentUser.parentProfile!.id;

  // 3. Children
  // Omar: Level 3, 240 XP, 5 day streak
  const omarUser = await prisma.user.create({
    data: {
      fullName: "Omar Kareem",
      email: "omar@noorkids.com",
      passwordHash: omarPassword,
      role: "CHILD",
      childProfile: {
        create: {
          parentId,
          age: 8,
          avatar: "star-boy",
          xpPoints: 240,
          level: 3,
          currentStreak: 5,
          lastActiveDay: new Date().toISOString().split("T")[0],
        },
      },
    },
    include: {
      childProfile: true,
    },
  });

  // Sara: Level 1, 50 XP, 2 day streak
  const saraUser = await prisma.user.create({
    data: {
      fullName: "Sara Kareem",
      email: "sara@noorkids.com",
      passwordHash: saraPassword,
      role: "CHILD",
      childProfile: {
        create: {
          parentId,
          age: 6,
          avatar: "star-girl",
          xpPoints: 50,
          level: 1,
          currentStreak: 2,
          lastActiveDay: new Date().toISOString().split("T")[0],
        },
      },
    },
    include: {
      childProfile: true,
    },
  });

  const omarChildId = omarUser.childProfile!.id;
  const saraChildId = saraUser.childProfile!.id;

  console.log("Creating Badges...");
  const badgesData = [
    {
      name: "Quran Explorer",
      description: "Recited Surahs and reflected on the words of Allah.",
      icon: "BookOpen",
      requiredXP: 50,
      categoryCondition: "QURAN",
    },
    {
      name: "Prayer Star",
      description: "Learned the steps of Wudu and honored the 5 Daily Prayers.",
      icon: "Sparkles",
      requiredXP: 50,
      categoryCondition: "SALAH",
    },
    {
      name: "Young Learner",
      description: "Earned more than 100 XP through continuous curiosity and hard work.",
      icon: "GraduationCap",
      requiredXP: 100,
      categoryCondition: null,
    },
    {
      name: "Kind Heart",
      description: "Showed honesty, kindness to parents, and good manners.",
      icon: "Heart",
      requiredXP: 50,
      categoryCondition: "MUSLIM_CHARACTER",
    },
    {
      name: "Ramadan Explorer",
      description: "Discovered the blessings of fasting and giving Sadaqah.",
      icon: "Moon",
      requiredXP: 50,
      categoryCondition: "RAMADAN",
    },
  ];

  const createdBadges = [];
  for (const b of badgesData) {
    const badge = await prisma.badge.create({ data: b });
    createdBadges.push(badge);
  }

  // Award Omar badges (Young Learner & Quran Explorer)
  const quranBadge = createdBadges.find((b) => b.categoryCondition === "QURAN")!;
  const youngLearnerBadge = createdBadges.find((b) => b.name === "Young Learner")!;
  await prisma.childBadge.createMany({
    data: [
      { childId: omarChildId, badgeId: quranBadge.id },
      { childId: omarChildId, badgeId: youngLearnerBadge.id },
    ],
  });

  console.log("Creating 5 Learning Paths & Bilingual Lessons...");

  // PATH 1: QURAN
  const quranCourse = await prisma.course.create({
    data: {
      title: "Holy Quran (القرآن الكريم)",
      category: "QURAN",
      description: "Discover beautiful short Surahs with Arabic recitation, English meaning, and life lessons.",
      icon: "BookOpen",
      colorTheme: "sky",
      orderIndex: 1,
      lessons: {
        create: [
          {
            title: "Surah Al-Fatihah: The Opening (سورة الفاتحة)",
            arabicHighlight: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
            xpReward: 30,
            orderIndex: 1,
            challengePrompt: "Recite Surah Al-Fatihah slowly with your parent before sleep tonight!",
            content: JSON.stringify([
              {
                step: 1,
                title: "The Greatest Surah (أم الكتاب)",
                englishText: "Surah Al-Fatihah is recited in every single Rak'ah of our prayers. It means 'The Opening' because it opens the Holy Quran.",
                arabicText: "سُورَةُ الْفَاتِحَةِ هِيَ أَعْظَمُ سُورَةٍ فِي الْقُرْآنِ الْكَرِيمِ",
              },
              {
                step: 2,
                title: "Praising Allah (الحمد لله)",
                englishText: "We start by saying 'Al-Hamdu lillah' - all thanks and praise belong to Allah, who cares for everyone and everything in the worlds.",
                arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
              },
              {
                step: 3,
                title: "Asking for Guidance (اهدنا الصراط المستقيم)",
                englishText: "In this Surah, we ask Allah to show us the straight path: the path of truth, kindness, and goodness.",
                arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Surah Al-Fatihah Knowledge Check",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What does 'Al-Fatihah' mean in English?",
                        options: JSON.stringify(["The River", "The Opening", "The Night", "The Star"]),
                        correctAnswer: "The Opening",
                        explanation: "Al-Fatihah (الفاتحة) means 'The Opening' because it opens the Book of Allah.",
                        orderIndex: 1,
                      },
                      {
                        questionText: "What do we say when we thank Allah for all blessings?",
                        options: JSON.stringify(["Astaghfirullah", "SubhanAllah", "Al-Hamdu lillah", "Allahu Akbar"]),
                        correctAnswer: "Al-Hamdu lillah",
                        explanation: "'Al-Hamdu lillah' (الْحَمْدُ لِلَّهِ) means all praise and gratitude belong to Allah.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "How often do Muslims recite Surah Al-Fatihah?",
                        options: JSON.stringify(["Only once a year", "In every unit (Rak'ah) of prayer", "Only on Eid", "Never"]),
                        correctAnswer: "In every unit (Rak'ah) of prayer",
                        explanation: "Surah Al-Fatihah is recited in every Rak'ah of our daily Salah!",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Surah Al-Ikhlas: Purity of Faith (سورة الإخلاص)",
            arabicHighlight: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            xpReward: 30,
            orderIndex: 2,
            challengePrompt: "Practice reciting Surah Al-Ikhlas three times today. The Prophet ﷺ taught us it equals one third of the Quran!",
            content: JSON.stringify([
              {
                step: 1,
                title: "Allah is One (الله أحد)",
                englishText: "Surah Al-Ikhlas teaches us the most important belief: Allah is One, unique, with no partners and no equals.",
                arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
              },
              {
                step: 2,
                title: "The Eternal Refuge (الله الصمد)",
                englishText: "'As-Samad' means everyone needs Allah, but Allah needs nobody. He is eternal, loving, and always listens to our Duas.",
                arabicText: "اللَّهُ الصَّمَدُ",
              },
              {
                step: 3,
                title: "Unique and Incomparable (لم يكن له كفواً أحد)",
                englishText: "Nothing is like Allah. He has no parents, no children, and no equal. He created the universe with immense wisdom.",
                arabicText: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Surah Al-Ikhlas Knowledge Check",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What does 'Ahad' (أَحَد) mean in Surah Al-Ikhlas?",
                        options: JSON.stringify(["The One and Only", "The Giant", "The Morning", "The Traveler"]),
                        correctAnswer: "The One and Only",
                        explanation: "Ahad signifies that Allah is One, with no partners.",
                        orderIndex: 1,
                      },
                      {
                        questionText: "According to Hadith, reciting Surah Al-Ikhlas equals what portion of the Quran?",
                        options: JSON.stringify(["One half", "One third", "One quarter", "One tenth"]),
                        correctAnswer: "One third",
                        explanation: "The Prophet Muhammad ﷺ said Surah Al-Ikhlas is equal to one-third of the Quran in reward!",
                        orderIndex: 2,
                      },
                      {
                        questionText: "What does 'As-Samad' (الصَّمَد) mean?",
                        options: JSON.stringify(["The One whom all creatures depend upon", "The Ocean", "The Sky", "The Quiet"]),
                        correctAnswer: "The One whom all creatures depend upon",
                        explanation: "As-Samad is the Eternal Master whom all creation needs, while He needs none.",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // PATH 2: SALAH
  const salahCourse = await prisma.course.create({
    data: {
      title: "Prayer Journey (رحلة الصلاة)",
      category: "SALAH",
      description: "Learn how to make sparkling Wudu, the five daily prayers, and talking to Allah with your heart.",
      icon: "Sparkles",
      colorTheme: "mint",
      orderIndex: 2,
      lessons: {
        create: [
          {
            title: "The Beauty of Wudu (طهارة الوضوء)",
            arabicHighlight: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
            xpReward: 30,
            orderIndex: 1,
            challengePrompt: "Make Wudu mindfully for your next prayer without wasting water!",
            content: JSON.stringify([
              {
                step: 1,
                title: "Begin with Bismillah (بسم الله)",
                englishText: "We start Wudu by saying 'Bismillah' and washing both hands up to the wrists three times.",
                arabicText: "نَبْدَأُ بِقَوْلِ: بِسْمِ اللَّهِ وَغَسْلِ الْكَفَّيْنِ ثَلَاثَ مَرَّاتٍ",
              },
              {
                step: 2,
                title: "Mouth, Nose and Face",
                englishText: "Rinse mouth (Madmadah), sniff water gently into nose (Istinshaq), and wash entire face three times.",
                arabicText: "الْمَضْمَضَةُ، وَالِاسْتِنْشَاقُ، وَغَسْلُ الْوَجْهِ كَامِلاً ثَلَاثاً",
              },
              {
                step: 3,
                title: "Arms, Hair, Ears and Feet",
                englishText: "Wash arms to elbows, wipe moist hands over hair and ears, and wash feet up to the ankles. You are clean and ready to stand before Allah!",
                arabicText: "غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ، مَسْحُ الرَّأْسِ وَالْأُذُنَيْنِ، وَغَسْلُ الرِّجْلَيْنِ إِلَى الْكَعْبَيْنِ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Wudu Steps Master Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What do we say before starting Wudu?",
                        options: JSON.stringify(["Bismillah", "Allahu Akbar", "SubhanAllah", "Assalamu Alaikum"]),
                        correctAnswer: "Bismillah",
                        explanation: "We always begin Wudu by mentioning Allah's name: Bismillah (بِسْمِ اللَّهِ).",
                        orderIndex: 1,
                      },
                      {
                        questionText: "How many times do we usually wash our hands, face, and arms in Wudu?",
                        options: JSON.stringify(["10 times", "3 times", "5 times", "7 times"]),
                        correctAnswer: "3 times",
                        explanation: "The Sunnah is to wash each limb 3 times cleanly without wasting water.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "What should we be careful about with water while making Wudu?",
                        options: JSON.stringify(["Waste as much as possible", "Do not waste water", "Use warm juice", "Only use a swimming pool"]),
                        correctAnswer: "Do not waste water",
                        explanation: "Our Prophet ﷺ taught us never to waste water, even at a flowing river!",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "The Five Daily Prayers (الصلوات الخمس)",
            arabicHighlight: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
            xpReward: 30,
            orderIndex: 2,
            challengePrompt: "Ask your mom or dad which prayer is next, and offer to pray together!",
            content: JSON.stringify([
              {
                step: 1,
                title: "Morning Light: Fajr (الفجر)",
                englishText: "Fajr is 2 Rak'ahs prayed before sunrise. It wakes our heart with peace and remembrance of Allah.",
                arabicText: "صَلَاةُ الْفَجْرِ: رَكْعَتَانِ قَبْلَ شُرُوقِ الشَّمْسِ",
              },
              {
                step: 2,
                title: "Afternoon Prayers: Dhuhr & Asr (الظهر والعصر)",
                englishText: "Dhuhr (4 Rak'ahs) at midday, and Asr (4 Rak'ahs) in late afternoon keep us connected with Allah throughout our busy day.",
                arabicText: "صَلَاةُ الظُّهْرِ (٤ رَكَعَاتٍ) وَصَلَاةُ الْعَصْرِ (٤ رَكَعَاتٍ)",
              },
              {
                step: 3,
                title: "Sunset & Night: Maghrib & Isha (المغرب والعشاء)",
                englishText: "Maghrib (3 Rak'ahs) just after sunset, and Isha (4 Rak'ahs) at night bring peace before we rest and sleep.",
                arabicText: "صَلَاةُ الْمَغْرِبِ (٣ رَكَعَاتٍ) وَصَلَاةُ الْعِشَاءِ (٤ رَكَعَاتٍ)",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Five Daily Prayers Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "How many obligatory daily prayers are there in Islam?",
                        options: JSON.stringify(["3", "5", "7", "2"]),
                        correctAnswer: "5",
                        explanation: "Muslims pray 5 obligatory prayers daily: Fajr, Dhuhr, Asr, Maghrib, and Isha.",
                        orderIndex: 1,
                      },
                      {
                        questionText: "How many Rak'ahs are in the Fajr prayer?",
                        options: JSON.stringify(["2 Rak'ahs", "4 Rak'ahs", "3 Rak'ahs", "1 Rak'ah"]),
                        correctAnswer: "2 Rak'ahs",
                        explanation: "Fajr consists of 2 obligatory Rak'ahs.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "Which prayer is performed right after the sunset?",
                        options: JSON.stringify(["Maghrib", "Fajr", "Dhuhr", "Asr"]),
                        correctAnswer: "Maghrib",
                        explanation: "Maghrib (المغرب) is prayed immediately after sunset.",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // PATH 3: RAMADAN
  const ramadanCourse = await prisma.course.create({
    data: {
      title: "Ramadan & Fasting (رمضان المبارك)",
      category: "RAMADAN",
      description: "Celebrate the month of mercy, learn the spirit of fasting, and collect good deeds every day.",
      icon: "Moon",
      colorTheme: "amber",
      orderIndex: 3,
      lessons: {
        create: [
          {
            title: "Welcome Ramadan & Fasting Basics (شهر الصيام)",
            arabicHighlight: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
            xpReward: 30,
            orderIndex: 1,
            challengePrompt: "Memorize the Iftar Dua and share a date with someone at mealtime!",
            content: JSON.stringify([
              {
                step: 1,
                title: "What is Fasting? (الصوم)",
                englishText: "Fasting (Sawm) means stopping eating and drinking from dawn (Fajr) until sunset (Maghrib), and training our hearts to be patient and kind.",
                arabicText: "الصِّيَامُ هُوَ الإِمْسَاكُ عَنِ الطَّعَامِ وَالشَّرَابِ مِنْ طُلُوعِ الْفَجْرِ إِلَى غُرُوبِ الشَّمْسِ",
              },
              {
                step: 2,
                title: "The Blessed Meals: Suhoor & Iftar",
                englishText: "We wake up early for Suhoor to gain energy, and we break our fast happily at Iftar, often with sweet dates and water.",
                arabicText: "السُّحُورُ بَرَكَةٌ، وَالإِفْطَارُ فَرْحَةٌ لِلصَّائِمِ",
              },
              {
                step: 3,
                title: "The Iftar Dua (دعاء الإفطار)",
                englishText: "When breaking the fast, we say: 'Dhahaba adh-Dhama'u wabtallat al-'urooqu wa thabata al-ajru in sha Allah' (The thirst is gone, veins are moistened, and reward is secured by Allah's will).",
                arabicText: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Ramadan Basics Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What is the pre-dawn meal before fasting starts called?",
                        options: JSON.stringify(["Suhoor", "Iftar", "Dinner", "Brunch"]),
                        correctAnswer: "Suhoor",
                        explanation: "Suhoor (السحور) is the blessed early morning meal eaten before Fajr.",
                        orderIndex: 1,
                      },
                      {
                        questionText: "What food did the Prophet Muhammad ﷺ recommend breaking fast with?",
                        options: JSON.stringify(["Dates and water", "Ice cream", "Hot chips", "Soda"]),
                        correctAnswer: "Dates and water",
                        explanation: "The Prophet ﷺ usually broke his fast with fresh dates or water.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "At which prayer time do Muslims break their fast?",
                        options: JSON.stringify(["Maghrib", "Dhuhr", "Fajr", "Asr"]),
                        correctAnswer: "Maghrib",
                        explanation: "The fast ends at sunset when the Maghrib Adhan is called.",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Good Deeds & Sadaqah in Ramadan (فعل الخيرات والصدقة)",
            arabicHighlight: "مَن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً",
            xpReward: 30,
            orderIndex: 2,
            challengePrompt: "Put a coin or dollar in a charity jar or help clear the dining table after dinner today!",
            content: JSON.stringify([
              {
                step: 1,
                title: "Multiplying Rewards (مضاعفة الأجر)",
                englishText: "In Ramadan, every good deed is multiplied many times! Smiling, reading Quran, and helping elders are rewarded immensely.",
                arabicText: "تُضَاعَفُ الأُجُورُ فِي شَهْرِ رَمَضَانَ الْمُبَارَكِ",
              },
              {
                step: 2,
                title: "Smiling is Sadaqah (تبسمك في وجه أخيك صدقة)",
                englishText: "You don't need a lot of money to give charity. Even smiling warmly at your brother, sister, or friend is a Sadaqah in Islam!",
                arabicText: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
              },
              {
                step: 3,
                title: "Sharing Food (إطعام الطعام)",
                englishText: "Giving food or water to someone fasting gives you the same reward as their fast without decreasing theirs at all!",
                arabicText: "مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Sadaqah & Good Deeds Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What simple action is considered a Sadaqah (charity) that costs zero money?",
                        options: JSON.stringify(["Smiling at your brother or sister", "Sleeping all day", "Watching TV", "Buying new toys"]),
                        correctAnswer: "Smiling at your brother or sister",
                        explanation: "The Prophet ﷺ taught: 'Smiling in the face of your brother is charity.'",
                        orderIndex: 1,
                      },
                      {
                        questionText: "What happens to the rewards of good deeds in Ramadan?",
                        options: JSON.stringify(["They are multiplied many times", "They stay the same", "They decrease", "Nothing happens"]),
                        correctAnswer: "They are multiplied many times",
                        explanation: "Allah generously multiplies rewards for good deeds during Ramadan.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "What is the reward for feeding someone who is fasting?",
                        options: JSON.stringify(["The same reward as their fast", "No reward", "One golden star", "Free cookies"]),
                        correctAnswer: "The same reward as their fast",
                        explanation: "The Prophet ﷺ said whoever feeds a fasting person gets a reward like theirs!",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // PATH 4: ISLAMIC STORIES
  const storiesCourse = await prisma.course.create({
    data: {
      title: "Stories of the Prophets (قصص الأنبياء)",
      category: "ISLAMIC_STORIES",
      description: "Inspiring adventures of brave Prophets who taught faith, patience, and unwavering trust in Allah.",
      icon: "Scroll",
      colorTheme: "rose",
      orderIndex: 4,
      lessons: {
        create: [
          {
            title: "Prophet Nuh (Noah) and the Great Ark (سيدنا نوح عليه السلام)",
            arabicHighlight: "وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا",
            xpReward: 30,
            orderIndex: 1,
            challengePrompt: "Draw a colorful picture of Prophet Nuh's ark carrying pairs of animals!",
            content: JSON.stringify([
              {
                step: 1,
                title: "Calling People with Patience (صبر نوح)",
                englishText: "Prophet Nuh called his people to worship Allah for 950 years with incredible patience and love, never giving up.",
                arabicText: "دَعَا سَيِّدُنَا نُوحٌ قَوْمَهُ بِصَبْرٍ وَحِكْمَةٍ سِنِينَ طَوِيلَةً",
              },
              {
                step: 2,
                title: "Building the Giant Ship (بناء السفينة)",
                englishText: "Allah commanded Nuh to build a huge wooden ship in the middle of dry land. People laughed, but Nuh trusted Allah completely.",
                arabicText: "أَمَرَ اللَّهُ نُوحاً أَنْ يَبْنِيَ سَفِينَةً عَظِيمَةً",
              },
              {
                step: 3,
                title: "Safety for Believers and Animals (النجاة)",
                englishText: "The rain poured and water surged, but the Ark floated safely carrying believers and pairs of every creature on Earth.",
                arabicText: "نَجَّى اللَّهُ سَيِّدَنَا نُوحًا وَمَنْ مَعَهُ فِي السَّفِينَةِ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Prophet Nuh Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What did Allah instruct Prophet Nuh (AS) to build?",
                        options: JSON.stringify(["A huge ship (Ark)", "A palace of stone", "A pyramid", "A bridge"]),
                        correctAnswer: "A huge ship (Ark)",
                        explanation: "Allah commanded Prophet Nuh to build the Ark (الفلك) to save the believers and animals.",
                        orderIndex: 1,
                      },
                      {
                        questionText: "How did Prophet Nuh act when some people doubted and mocked him?",
                        options: JSON.stringify(["He remained patient and trusted Allah", "He gave up immediately", "He got angry and stopped", "He ran away"]),
                        correctAnswer: "He remained patient and trusted Allah",
                        explanation: "Prophet Nuh showed inspiring patience (Sabr) and absolute trust in Allah.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "Who was saved aboard the Ark?",
                        options: JSON.stringify(["Believers and pairs of animals", "Only gold and silver", "The kings of the town", "Nobody"]),
                        correctAnswer: "Believers and pairs of animals",
                        explanation: "Allah saved the righteous believers and a male-female pair of every animal species.",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Prophet Yusuf (Joseph) and Forgiveness (سيدنا يوسف عليه السلام)",
            arabicHighlight: "قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللَّهُ لَكُمْ ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
            xpReward: 30,
            orderIndex: 2,
            challengePrompt: "If anyone upset you today, forgive them in your heart for the sake of Allah!",
            content: JSON.stringify([
              {
                step: 1,
                title: "The Special Dream (الرؤيا الجميلة)",
                englishText: "Young Yusuf saw eleven stars, the sun, and the moon prostrating to him. His loving father Ya'qub knew Yusuf had a noble destiny.",
                arabicText: "رَأَى يُوسُفُ أَحَدَ عَشَرَ كَوْكَبًا وَالشَّمْسَ وَالْقَمَرَ لَهُ سَاجِدِينَ",
              },
              {
                step: 2,
                title: "Patience in Every Trial (الصبر الجميل)",
                englishText: "Even when thrown in a deep well and later put into prison falsely, Yusuf never lost his radiant faith in Allah.",
                arabicText: "صَبَرَ يُوسُفُ عَلَى الشَّدَائِدِ فَأَكْرَمَهُ اللَّهُ بِالْمُلْكِ وَالْحِكْمَةِ",
              },
              {
                step: 3,
                title: "The Noble Forgiveness (العفو الجميل)",
                englishText: "When Yusuf became minister of Egypt and his brothers came needing food, he forgave them completely with love and mercy!",
                arabicText: "قَالَ: لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ يَغْفِرُ اللَّهُ لَكُمْ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Prophet Yusuf Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What did Prophet Yusuf do when his brothers asked him for forgiveness?",
                        options: JSON.stringify(["He forgave them with great mercy", "He punished them", "He sent them away", "He refused to speak"]),
                        correctAnswer: "He forgave them with great mercy",
                        explanation: "Prophet Yusuf said 'No blame will there be upon you today; may Allah forgive you!'",
                        orderIndex: 1,
                      },
                      {
                        questionText: "Who was Prophet Yusuf's father?",
                        options: JSON.stringify(["Prophet Ya'qub (Jacob)", "Prophet Musa", "Prophet Ibrahim", "Prophet Isa"]),
                        correctAnswer: "Prophet Ya'qub (Jacob)",
                        explanation: "His father was Prophet Ya'qub (عليه السلام).",
                        orderIndex: 2,
                      },
                      {
                        questionText: "What beautiful quality did Prophet Yusuf show throughout his difficult tests?",
                        options: JSON.stringify(["Patience and trust in Allah", "Impatience and shouting", "Hopelessness", "Pride"]),
                        correctAnswer: "Patience and trust in Allah",
                        explanation: "Yusuf demonstrated Sabr (patient perseverance) and unwavering trust in Allah.",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  // PATH 5: MUSLIM CHARACTER
  const characterCourse = await prisma.course.create({
    data: {
      title: "Muslim Character & Manners (الأخلاق والآداب)",
      category: "MUSLIM_CHARACTER",
      description: "Build a glowing golden character with honesty, respect for parents, kindness, and cheerful manners.",
      icon: "Heart",
      colorTheme: "indigo",
      orderIndex: 5,
      lessons: {
        create: [
          {
            title: "Truthfulness & Honesty (خلق الصدق والأمانة)",
            arabicHighlight: "عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ",
            xpReward: 30,
            orderIndex: 1,
            challengePrompt: "Tell the truth in everything you say today, especially if you made a little mistake!",
            content: JSON.stringify([
              {
                step: 1,
                title: "As-Sadiq Al-Amin (الصادق الأمين)",
                englishText: "Even before becoming a Prophet, our beloved Muhammad ﷺ was known across Mecca as 'As-Sadiq Al-Amin' (The Truthful and Trustworthy).",
                arabicText: "كَانَ رَسُولُ اللَّهِ ﷺ يُلَقَّبُ بِالصَّادِقِ الأَمِينِ",
              },
              {
                step: 2,
                title: "Speaking Truth Brings Peace",
                englishText: "Honesty brings tranquility to our heart. When we make a mistake, admitting it honestly is heroic and pleasing to Allah.",
                arabicText: "الصِّدْقُ طُمَأْنِينَةٌ وَرَاحَةٌ لِلْقَلْبِ",
              },
              {
                step: 3,
                title: "Keeping Promises (الوفاء بالعهد)",
                englishText: "A young Muslim always honors promises. If you promise your mom, teacher, or friend, do your best to fulfill it!",
                arabicText: "الْمُسْلِمُ يُوفِي بِعَهْدِهِ وَيَحْفَظُ أَمَانَتَهُ",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Honesty & Truthfulness Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What noble title was given to Prophet Muhammad ﷺ by his community?",
                        options: JSON.stringify(["As-Sadiq Al-Amin (The Truthful & Trustworthy)", "The Mighty King", "The Fast Runner", "The Builder"]),
                        correctAnswer: "As-Sadiq Al-Amin (The Truthful & Trustworthy)",
                        explanation: "He was beloved and respected as As-Sadiq (The Truthful) and Al-Amin (The Trustworthy).",
                        orderIndex: 1,
                      },
                      {
                        questionText: "What should you do if you break a cup by accident?",
                        options: JSON.stringify(["Admit it honestly to your parents", "Blame your cat", "Hide it under the couch", "Pretend it wasn't you"]),
                        correctAnswer: "Admit it honestly to your parents",
                        explanation: "Speaking the truth even when difficult shows brave Muslim character!",
                        orderIndex: 2,
                      },
                      {
                        questionText: "According to the Hadith, where does truthfulness (Sidq) lead?",
                        options: JSON.stringify(["To righteousness and Paradise", "To sadness", "To confusion", "To getting lost"]),
                        correctAnswer: "To righteousness and Paradise",
                        explanation: "The Prophet ﷺ said: 'Truthfulness leads to righteousness, and righteousness leads to Paradise.'",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: "Kindness to Parents: Birr Al-Walidayn (بر الوالدين)",
            arabicHighlight: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ الْكِبَرَ أَحَدُهُمَا أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًا كَرِيمًا",
            xpReward: 30,
            orderIndex: 2,
            challengePrompt: "Give both your mom and dad a hug today, and say: 'Rabbi irhamhuma kama rabbayani sagheera'!",
            content: JSON.stringify([
              {
                step: 1,
                title: "The Golden Commandment (الإحسان بالوالدين)",
                englishText: "Right after commanding us to worship Him alone, Allah commanded us to be wonderfully kind to our parents.",
                arabicText: "قَرَنَ اللَّهُ عِبَادَتَهُ بِالإِحْسَانِ إِلَى الْوَالِدَيْنِ",
              },
              {
                step: 2,
                title: "Never Say 'Uff' (فلا تقل لهما أف)",
                englishText: "Allah asks us never to show frustration, grumble, or say 'Uff' to our parents. Speak to them with gentle and honoring words.",
                arabicText: "قُلْ لَهُمَا قَوْلًا كَرِيمًا لَطِيفًا مَلِيئًا بِالْحُبِّ",
              },
              {
                step: 3,
                title: "The Dua for Parents (دعاء للوالدين)",
                englishText: "The Quran gives us a lovely Dua to make for parents: 'My Lord, have mercy upon them as they brought me up when I was small.'",
                arabicText: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
              },
            ]),
            quizzes: {
              create: [
                {
                  title: "Kindness to Parents Quiz",
                  passingScore: 70,
                  bonusXP: 25,
                  questions: {
                    create: [
                      {
                        questionText: "What word does the Quran explicitly tell children not to say to parents?",
                        options: JSON.stringify(["'Uff' (expressing irritation)", "'Please'", "'Thank you'", "'Salam'"]),
                        correctAnswer: "'Uff' (expressing irritation)",
                        explanation: "Surah Al-Isra verse 23 advises: 'do not say to them so much as 'uff' and do not repel them'.",
                        orderIndex: 1,
                      },
                      {
                        questionText: "What is the English meaning of the Dua: 'Rabbi irhamhuma kama rabbayani sagheera'?",
                        options: JSON.stringify(["My Lord, have mercy on them as they raised me when I was small", "My Lord, give me sweets", "My Lord, make it rain", "My Lord, give me more toys"]),
                        correctAnswer: "My Lord, have mercy on them as they raised me when I was small",
                        explanation: "It is the beloved Quranic prayer for mothers and fathers.",
                        orderIndex: 2,
                      },
                      {
                        questionText: "How can children show Birr (goodness) to parents every day?",
                        options: JSON.stringify(["Listen respectfully, help around the house, and smile", "Refuse to do chores", "Ignore them", "Shout loudly"]),
                        correctAnswer: "Listen respectfully, help around the house, and smile",
                        explanation: "Helping, smiling, and speaking gently are noble acts of Birr Al-Walidayn.",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Populating initial progress & quiz history for Omar & Sara...");
  // Let's get the first lesson of Quran (Surah Al-Fatihah) and first lesson of Salah (Wudu)
  const allLessons = await prisma.lesson.findMany({
    include: { quizzes: true },
  });

  const fatihahLesson = allLessons.find((l) => l.title.includes("Fatihah"))!;
  const ikhlasLesson = allLessons.find((l) => l.title.includes("Ikhlas"))!;
  const wuduLesson = allLessons.find((l) => l.title.includes("Wudu"))!;
  const fastingLesson = allLessons.find((l) => l.title.includes("Fasting"))!;

  // Omar completed Fatihah, Ikhlas, and Wudu
  if (fatihahLesson) {
    await prisma.progress.create({
      data: {
        childId: omarChildId,
        lessonId: fatihahLesson.id,
        isCompleted: true,
        completionPercentage: 100,
      },
    });

    if (fatihahLesson.quizzes[0]) {
      await prisma.quizResult.create({
        data: {
          childId: omarChildId,
          quizId: fatihahLesson.quizzes[0].id,
          score: 100,
          totalQuestions: 3,
          earnedXP: 55, // 30 + 25 bonus
        },
      });
    }
  }

  if (ikhlasLesson) {
    await prisma.progress.create({
      data: {
        childId: omarChildId,
        lessonId: ikhlasLesson.id,
        isCompleted: true,
        completionPercentage: 100,
      },
    });

    if (ikhlasLesson.quizzes[0]) {
      await prisma.quizResult.create({
        data: {
          childId: omarChildId,
          quizId: ikhlasLesson.quizzes[0].id,
          score: 100,
          totalQuestions: 3,
          earnedXP: 55,
        },
      });
    }
  }

  if (wuduLesson) {
    await prisma.progress.create({
      data: {
        childId: omarChildId,
        lessonId: wuduLesson.id,
        isCompleted: true,
        completionPercentage: 100,
      },
    });

    if (wuduLesson.quizzes[0]) {
      await prisma.quizResult.create({
        data: {
          childId: omarChildId,
          quizId: wuduLesson.quizzes[0].id,
          score: 100,
          totalQuestions: 3,
          earnedXP: 55,
        },
      });
    }
  }

  // Sara started Fatihah
  if (fatihahLesson) {
    await prisma.progress.create({
      data: {
        childId: saraChildId,
        lessonId: fatihahLesson.id,
        isCompleted: true,
        completionPercentage: 100,
      },
    });

    if (fatihahLesson.quizzes[0]) {
      await prisma.quizResult.create({
        data: {
          childId: saraChildId,
          quizId: fatihahLesson.quizzes[0].id,
          score: 67, // passed 2/3
          totalQuestions: 3,
          earnedXP: 40,
        },
      });
    }
  }

  console.log("✅ Seed completed successfully!");
  console.log("-----------------------------------------");
  console.log("🔑 Demo Accounts:");
  console.log("  • Admin:  admin@noorkids.com  / admin123");
  console.log("  • Parent: parent@noorkids.com / parent123");
  console.log("  • Child1: omar@noorkids.com   / omar123 (Lvl 3, 240 XP)");
  console.log("  • Child2: sara@noorkids.com   / sara123 (Lvl 1, 50 XP)");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
