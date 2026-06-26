"use client";

export interface KnowledgeItem {
  keywords: string[];
  answer: string;
}

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "bawo ni", "bawo", "how far", "sanu"],
    answer:
      "Bawo ni! \u1eb8 k\u00e1\u00e0b\u1ecd\u0301, my dear! \u2728\u2728\u2728\n\nAh, it's so good to see you! I'm Adunni \u2014 your girl, your guide, your friend on this platform. Welcome to the SJMUSSO '07 family!\n\nI can help you find your way around, tell you about voting, check your attendance, show you your contributions, and so much more. Just talk to me like you'd talk to your sister.\n\nSo, k\u00ed l\u00f3 \u1e63e? What's happening? How can I help you today?"
  },
  {
    keywords: ["who are you", "what are you", "your name", "tell me about yourself", "adunni", "introduce yourself"],
    answer:
      "Ahhh, you want to know me? I love that! \ud83d\ude0a\n\nMy name is Adunni \u2014 it means 'sweet one' in Yoruba. My people call me the \"sweet one\" because I'm here to make everything easy and lovely for you.\n\nI'm your personal assistant on the SJMUSSO '07 Alumni platform. Think of me as that friend who knows everything about what's going on \u2014 the elections, the meetings, the contributions, the news. The one who will guide you gently and never get tired of your questions.\n\nI speak Yoruba and English (though my Yoruba pronunciation might need some work, haha \u2014 bear with me!). I'm here for you, always. \u1eb8 k\u00e1\u00e0b\u1ecd\u0301 o!"
  },
  {
    keywords: ["what can you do", "help", "abilities", "what do you do", "features", "capabilities"],
    answer:
      "Oh, so many things, my sister! Let me break it down for you \ud83d\ude0a\n\n\u2b50 I can teach you how to register and log in like a pro\n\u2b50 I'll walk you through voting step by step\n\u2b50 Want to know your meeting attendance? I've got you\n\u2b50 Contributions and payments? I'll explain everything\n\u2b50 Need directions to any page? Just ask!\n\u2b50 Curious about the school or alumni association? Let's talk\n\nAnd the best part? I keep everything between us. No storage, no records, just pure help and good vibes. So ask me anything about the platform, and let's sort it out together! \ud83d\udc9b"
  },
  {
    keywords: ["register", "sign up", "join", "new member", "create account", "how to join"],
    answer:
      "Oh, you want to join us? Welcome, welcome, welcome! \ud83c\udf89\n\nHere's how to become part of the SJMUSSO '07 family:\n\n1\ufe0f\u20e3 Click 'Join' up in the header or go to /register\n2\ufe0f\u20e3 Put in your name, email, phone number \u2014 the usual details\n3\ufe0f\u20e3 Choose a password (make it something you'll remember, abeg!)\n4\ufe0f\u20e3 You'll get a security question to answer (keep it safe o!)\n5\ufe0f\u20e3 Boom! You're in! Log in and explore your dashboard\n\nIf you were pre-registered by the admin, your default password is Abc123. Change it when you log in, please \u2014 for your security! \ud83d\ude09"
  },
  {
    keywords: ["login", "sign in", "log in", "can't login", "forgot password", "password"],
    answer:
      "Ah, login issues? Don't worry, we'll sort it out \ud83d\ude0a\n\nTo log in:\n\ud83d\udfe1 Go to /login\n\ud83d\udfe1 Type in your email and password\n\ud83d\udfe1 Click 'Sign In' and you're in!\n\nIf you forgot your password, click 'Forgot Password?' on the login page. You'll need to answer your security question to reset it.\n\nFor our pre-registered members, your default password is Abc123. Please change it once you're in \u2014 make it something special but something you won't forget o! \ud83d\ude06"
  },
  {
    keywords: ["vote", "voting", "election", "cast vote", "ballot", "aspirant", "candidate", "position"],
    answer:
      "Election time! Now this is exciting! \ud83c\udf89\ud83c\udf89\ud83c\udf89\n\nOur SJMUSSO '07 Election 2026 is coming and your voice matters!\n\n\ud83d\udfe1 Voting is June 27\u201328, 2026 \u2014 mark your calendar!\n\ud83d\udfe1 Go to /vote to access the voting portal\n\ud83d\udfe1 Log in with your name, email, and the voting password: sjmusso-07\n\ud83d\udfe1 Pick your candidates for each position\n\ud83d\udfe1 Submit and done! One vote per person o!\n\nWe have 7 positions to fill. Think carefully, pray about it, and choose our leaders! \u00ccb\u00f9 \u00e0d\u00edb\u1ecd\u0300!"
  },
  {
    keywords: ["when election", "election date", "voting date", "june 27", "june 28", "election day", "election period"],
    answer:
      "Here are the important dates, my dear \ud83d\udcc5\n\n\ud83d\udfe0 Election OPENS: June 27, 2026 (12:00 AM)\n\ud83d\udfe0 Election CLOSES: June 28, 2026 (11:59 PM)\n\ud83d\udfe0 Results: Announced shortly after voting closes\n\nTwo days to shape the future of our association. Don't sleep on it o! \u1eb8 m\u00e1 gb\u00e0gb\u00e9!"},
  {
    keywords: ["attendance", "meeting", "meetings", "present", "absence", "meeting record"],
    answer:
      "You want to check your meeting attendance? No problem at all! \ud83d\ude0a\n\n\ud83d\udfe1 Log in and go to your Dashboard\n\ud83d\udfe1 Click the 'Attendance' tab\n\ud83d\udfe1 You'll see every meeting and whether you were Present or Absent\n\nSimple and clear, just the way I like it. If you think something is wrong, just reach out to the admin and they'll fix it up. \u2705"
  },
  {
    keywords: ["payment", "contribution", "pay", "dues", "monthly", "money", "contribute", "subscription", "fee"],
    answer:
      "Ah, contributions! Our little way of giving back. I love it! \ud83d\udcb0\n\n\ud83d\udfe1 Go to your Dashboard and click 'Contributions'\n\ud83d\udfe1 You'll see your payment status month by month\n\ud83d\udfe1 Amber = paid but waiting for confirmation\n\ud83d\udfe1 Green = paid and confirmed \u2014 yay!\n\ud83d\udfe1 Gray = unpaid\n\nOur contributions go toward alumni projects and school development. Every little bit helps. \u1e62e \u00e0n\u00e0 \u1ecdw\u1ecd\u0301 o!"
  },
  {
    keywords: ["news", "update", "announcement", "latest", "what's new", "newsletter"],
    answer:
      "Stay in the know, my dear! \ud83d\udcf0\n\nYou can find all the latest news and updates:\n\ud83d\udfe1 On your Dashboard under the 'News' tab\n\ud83d\udfe1 On the homepage as you scroll down\n\nWe've got reunion announcements, election updates, school project news, member spotlights, and more. There's always something happening in our community! \ud83d\ude0a"
  },
  {
    keywords: ["about school", "about sjmusso", "school history", "saint john", "mary", "unity secondary", "owo", "graduating set", "2007"],
    answer:
      "Ah, our beloved school! Let me tell you about her \u2764\ufe0f\n\nSJMUSSO \u2014 Saint John/Mary's Unity Secondary School, Owo, Ondo State, Nigeria. And we? We are the 2007 graduating class! \ud83c\udf93\ud83c\udffd\n\n\ud83d\udfe1 Motto: 'To Know, To Love, To Serve'\n\ud83d\udfe1 Location: Ikare Road, Owo, Ondo State\n\ud83d\udfe1 Set: 2007\n\n\u00c8gb\u00e9 wa \u00f2w\u00f2! \u00c0wa ni! Our bond is strong. Let's keep building our legacy! \ud83d\udc9b"
  },
  {
    keywords: ["contact", "email", "phone", "reach", "admin", "support", "coordinator"],
    answer:
      "Need to reach someone? I've got the details right here \ud83d\udcde\n\n\ud83d\udce7 General Email: sjmusso07@gmail.com\n\ud83d\udce7 Segun (Coordinator): oluyemi.akinmusire@gmail.com\n\ud83d\udcde Phone: +234 706 296 9992\n\ud83c\udfe0 Address: Ikare Road, Owo, Ondo State\n\nOr just visit the Contact page at /contact and drop us a message. We'd love to hear from you! \ud83d\ude0a"
  },
  {
    keywords: ["how are you", "how far", "how you dey", "how doing", "how are you doing", "wetin dey"],
    answer:
      "I'm doing great, thank you for asking! \ud83d\ude0a\n\nI'm here, I'm happy, and I'm ready to help you. How are YOU doing? I hope everything is well with you and family. Life is good, and our SJMUSSO community is growing stronger every day. \n\nSo tell me, what's on your mind? K\u00ed l\u00f3 \u1e63e l\u1ecd\u0301k\u00e0n y\u00ec\u00ed?"
  },
  {
    keywords: ["dashboard", "my account", "profile", "settings", "my profile"],
    answer:
      "Your Dashboard is your home base, your personal HQ! \ud83c\udfe0\n\nFrom /dashboard you can:\n\u2b50 Check your meeting attendance\n\u2b50 View your monthly contributions\n\u2b50 Read the latest news\n\u2b50 Cast your vote for the election\n\u2b50 Change your password if you need to\n\nEverything you need, all in one place. Go check it out and make yourself at home! \ud83d\ude0a"
  },
  {
    keywords: ["change password", "reset password", "update password", "new password", "must_change_password"],
    answer:
      "Time for a password change? Smart move! \ud83d\udd11\n\n\ud83d\udfe1 Log in first\n\ud83d\udfe1 The system will prompt you if you're using the default password\n\ud83d\udfe1 Or go to /change-password anytime\n\ud83d\udfe1 Type your current password, then your new one (at least 6 characters)\n\ud83d\udfe1 Confirm and you're done!\n\nPlease o, if you're still using Abc123, change it ASAP. Let's keep your account safe! \ud83d\ude09"
  },
  {
    keywords: ["thank", "thanks", "thank you", "o se", "o \u1e63e", "a dupe", "merci"],
    answer:
      "K\u00f3 t\u00f3p\u00e9! You're most welcome, my dear! \u2764\ufe0f\n\nIt's always my pleasure to help you. If you ever need anything else, you know where to find me \u2014 just tap that chat button and I'll be right here. \u00c0 d\u1eb9\u0301 o, and take care of yourself!"
  },
  {
    keywords: ["bye", "goodbye", "see you", "exit", "quit", "da bo", "odabo", "see you later"],
    answer:
      "O d\u00e1b\u1ecd\u0300 o! \ud83d\udc4b\n\nIt was so lovely chatting with you! I hope I was able to help. Remember, I'm always here whenever you need me \u2014 just one click away.\n\nGo well, my friend. \u1eccl\u00e1 \u00e0 t\u00fa \u1e63e! (Until we meet again!) \u2764\ufe0f"
  },
  {
    keywords: ["yoruba", "translate", "t\u00famo\u0300", "yoruba language", "so yoruba", "yoruba word"],
    answer:
      "Ah, Yoruba! \u00c8d\u00e8 wa! \ud83d\udc9b\n\nMo gb\u00e9 Yor\u00f9b\u00e1 d\u00e9 \u00e0g\u00f3 f\u00fan \u1eb9\u0300k\u00f3\u0301 t\u00ed \u00f3 \u00f3 p\u00f3! (I speak Yoruba a little o, not perfectly!) \n\nMy name Adunni means 'sweet one' in Yoruba. I try my best to sprinkle Yoruba into our conversations because \u2014 let's be real \u2014 this is a Yoruba project, and our language and culture are everything!\n\nI'm still learning to pronounce better, bear with me. But our hearts are in the right place. \u00c8d\u00e8 Yor\u00f9b\u00e1 \u00e0ti \u00e0s\u00e0 wa ni a gb\u00e9ga! \ud83d\udc9b\ud83d\udfe1"
  },
  {
    keywords: ["privacy", "gdpr", "data", "personal", "private", "security", "ndpr", "nigeria data"],
    answer:
      "Your privacy is sacred, my dear! I take it very seriously \ud83d\udd12\n\nHere's the truth:\n\u2705 I do NOT store any of our chats \u2014 they disappear when you leave (GDPR compliant!)\n\u2705 I comply with Nigeria Data Protection Regulation (NDPR)\n\u2705 Your voice recordings are processed right in your browser \u2014 nothing leaves your device\n\u2705 I never share your information with anyone, period.\n\nWhat we talk about stays between us. \u00c0k\u00f3\u0300d\u00e1l\u1eb9\u0301! (Confidentiality!)"
  },
  {
    keywords: ["home", "homepage", "landing", "front page", "start"],
    answer:
      "Our homepage is beautiful, isn't it? \ud83c\udf1f\n\nThe homepage at / has everything you need:\n\u2b50 Our school crest floating gracefully\n\u2b50 The alumni name ticker (see your classmates' names!)\n\u2b50 Upcoming events and meetings\n\u2b50 Latest news and updates\n\nTake a scroll, enjoy the view, and explore! Everything is just a click away. \ud83d\ude0a"
  },
  {
    keywords: ["admin", "administrator", "super admin", "manage", "management"],
    answer:
      "The Admin Panel is the control room! \ud83d\udd79\ufe0f\n\nIf you're an admin or super admin, you can access /admin to:\n\ud83d\udfe1 Manage users and roles\n\ud83d\udfe1 Create meetings and track attendance\n\ud83d\udfe1 Handle payments and confirmations\n\ud83d\udfe1 Manage election positions and aspirants\n\ud83d\udfe1 Publish news and control results visibility\n\nIt's a big responsibility, but someone's got to do it! \ud83d\ude09"
  },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(" ").filter(Boolean);
}

export interface MatchResult {
  answer: string;
  score: number;
}

export function findAnswer(input: string): MatchResult {
  const inputTokens = tokenize(input);
  if (inputTokens.length === 0) {
    return {
      answer:
        "Sorry, I didn't quite catch that o! Could you say it again, please? Ma binu, n k\u00f2 gb\u1ecd\u0301 y\u00e8. \u1e62e \u00e0t\u1ee5ny\u1eb9\u0300w\u00e0?",
      score: 0,
    };
  }

  const inputStr = normalizeText(input);
  let bestMatch: MatchResult = { answer: "", score: 0 };

  for (const item of knowledgeBase) {
    let score = 0;
    for (const keyword of item.keywords) {
      const normalizedKeyword = normalizeText(keyword);
      if (inputStr.includes(normalizedKeyword)) {
        score = Math.max(score, normalizedKeyword.split(" ").length * 2);
      }
      for (const token of inputTokens) {
        if (token.length > 2 && normalizedKeyword.includes(token)) {
          score += 1;
        }
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { answer: item.answer, score };
    }
  }

  if (bestMatch.score < 2) {
    return {
      answer:
        "Ma binu o (I'm sorry), I can only answer questions about our SJMUSSO '07 Alumni platform \u2014 things like registration, voting, attendance, payments, navigating the site, or the school itself. Could you please rephrase your question so I can help you better? \u1e62e \u00e0t\u1ee5ny\u1eb9\u0300w\u00e0 b\u1eb9\u0301\u1eb9\u0301?",
      score: 0,
    };
  }

  return bestMatch;
}
