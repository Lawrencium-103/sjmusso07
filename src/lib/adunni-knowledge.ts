"use client";

export interface KnowledgeItem {
  keywords: string[];
  answer: string;
}

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "bawo ni", "bawo", "how far", "sanu"],
    answer: "Bawo ni! \u1eb8 k\u00e1\u00e0b\u1ecd\u0300! I'm Adunni, your SJMUSSO '07 alumni platform assistant. I'm here to help you navigate, vote, check attendance, manage contributions, and more. K\u00ed lo \u1e63e? (How can I help?)"
  },
  {
    keywords: ["who are you", "what are you", "your name", "tell me about yourself", "adunni", "introduce yourself"],
    answer: "My name is Adunni \u2014 it means 'sweet one' in Yoruba. I'm your AI guide for the SJMUSSO '07 Alumni platform. I can help you register, log in, vote in the election, check your meeting attendance, manage monthly contributions, read news, and find your way around. \u1eb8 k\u00e1\u00e0b\u1ecd\u0301 o!"
  },
  {
    keywords: ["what can you do", "help", "abilities", "what do you do", "features", "capabilities"],
    answer: "Mo l\u00e8 \u1e63e \u1ecd\u0300p\u1ecd̀l\u1ecd\u0301p\u1ecd̀! Here's what I can help with:\n\n\ud83d\udfe1 Guide you through registration and login\n\ud83d\udfe1 Explain how voting works and key dates\n\ud83d\udfe1 Check your meeting attendance records\n\ud83d\udfe1 Help with monthly contributions and payments\n\ud83d\udfe1 Show you news and updates\n\ud83d\udfe1 Navigate to any page on the platform\n\ud83d\udfe1 Answer questions about the school and alumni association\n\nJust type or speak your question!"
  },
  {
    keywords: ["register", "sign up", "join", "new member", "create account", "how to join"],
    answer: "To register on the platform:\n\n1. Go to the Register page (click 'Join' in the header or visit /register)\n2. Enter your name, email, phone number, and other details\n3. Set your password (at least 6 characters)\n4. You'll receive a verification step with a security question\n5. After registration, you can log in and access your dashboard!\n\n\u1eb8 k\u00e1\u00e0b\u1ecd\u0301 s\u00ed il\u1eb9\u0301 \u1eb9gb\u00e9 wa!"
  },
  {
    keywords: ["login", "sign in", "log in", "can't login", "forgot password", "password"],
    answer: "To log in:\n\n1. Go to the Login page (/login)\n2. Enter your registered email address\n3. Enter your password\n4. Click 'Sign In'\n\nIf you forgot your password, click 'Forgot Password?' on the login page. You'll need to answer your security question to reset it.\n\nFor new users who were pre-registered, your default password is Abc123. Please change it after your first login!"
  },
  {
    keywords: ["vote", "voting", "election", "cast vote", "ballot", "aspirant", "candidate", "position"],
    answer: "The SJMUSSO '07 Election 2026 is coming up!\n\n\ud83d\udfe1 Voting Dates: June 27\u201328, 2026\n\ud83d\udfe1 Visit the Voting Portal at /vote\n\ud83d\udfe1 You'll log in with your name, email, and voting password: sjmusso-07\n\ud83d\udfe1 Select your preferred candidates for each position\n\ud83d\udfe1 Submit your ballot \u2014 one vote per person!\n\n7 positions are available. Make your voice heard! \u00ecb\u00f9 \u00e0d\u00edb\u1ecd\u0300!"
  },
  {
    keywords: ["when election", "election date", "voting date", "june 27", "june 28", "election day", "election period"],
    answer: "The 2026 Election Schedule:\n\n\ud83d\udfe0 Elections open: June 27, 2026 (12:00 AM)\n\ud83d\udfe0 Elections close: June 28, 2026 (11:59 PM)\n\ud83d\udfe0 Results will be announced after voting closes\n\nMake sure to cast your vote during this window! \u1eb8 m\u00e1 gb\u00e0gb\u00e9!"
  },
  {
    keywords: ["attendance", "meeting", "meetings", "present", "absence", "meeting record"],
    answer: "To check your meeting attendance:\n\n1. Log in to your account\n2. Go to your Dashboard (/dashboard)\n3. Click on the 'Attendance' tab\n4. You'll see all meetings and your attendance status (Present/Absent)\n\nAdmins can also mark attendance for meetings. If you think there's an error, contact the admin."
  },
  {
    keywords: ["payment", "contribution", "pay", "dues", "monthly", "money", "contribute", "subscription", "fee"],
    answer: "Monthly Contributions:\n\n\ud83d\udfe1 Check your payment status on the Dashboard under 'Contributions'\n\ud83d\udfe1 Payments are recorded by month and year\n\ud83d\udfe1 Paid contributions show as amber (pending confirmation) or green (confirmed)\n\ud83d\udfe1 Admins can mark payments as paid and confirm them\n\nContributions support our alumni projects and school development. \u1e62e \u00e0n\u00e0 \u1ecdw\u1ecd́!"
  },
  {
    keywords: ["news", "update", "announcement", "latest", "what's new", "newsletter"],
    answer: "Stay up to date with the latest news! Visit the News section on your Dashboard or check the homepage for updates. You'll find information about:\n\n\ud83d\udcf0 Alumni reunions and events\n\ud83d\udcf0 Election updates\n\ud83d\udcf0 School development projects\n\ud83d\udcf0 Member spotlights\n\ud83d\udcf0 Association announcements"
  },
  {
    keywords: ["about school", "about sjmusso", "school history", "saint john", "mary", "unity secondary", "owo", "pioneer set", "2007"],
    answer: "SJMUSSO stands for Saint John/Mary's Unity Secondary School, Owo, Ondo State, Nigeria. We are the 2007 graduating class \u2014 the Pioneer Set! \n\n\ud83c\udf93 Motto: 'To Know, To Love, To Serve'\n\ud83d\udccd Location: Ikare Road, Owo, Ondo State\n\ud83c\udfc6 Set: 2007 (Pioneer Set)\n\n\u00c8gb\u00e9 wa \u00f2w\u00f2! \u00c0wa ni!"
  },
  {
    keywords: ["contact", "email", "phone", "reach", "admin", "support", "coordinator"],
    answer: "You can reach us through:\n\n\ud83d\udce7 General Email: sjmusso07@gmail.com\n\ud83d\udce7 Coordinator: oluyemi.akinmusire@gmail.com\n\ud83d\udcde Phone: +234 706 296 9992\n\ud83c\udfe0 Address: Ikare Road, Owo, Ondo State, Nigeria\n\nOr visit the Contact page (/contact) to send a message!"
  },
  {
    keywords: ["dashboard", "my account", "profile", "settings", "my profile"],
    answer: "Your Dashboard (/dashboard) is your personal hub. From there you can:\n\n\ud83d\udfe1 View your attendance records\n\ud83d\udfe1 Check your monthly contribution status\n\ud83d\udfe1 Read news and updates\n\ud83d\udfe1 Cast your vote\n\ud83d\udfe1 Change your password\n\nAdmins have additional access to manage users, meetings, payments, and more."
  },
  {
    keywords: ["change password", "reset password", "update password", "new password", "must_change_password"],
    answer: "To change your password:\n\n1. Log in to your account\n2. If prompted to change your default password, you can do so immediately\n3. Or go to /change-password\n4. Enter your current password, then your new password (min 6 characters)\n5. Confirm and save\n\nFor security, please change your password if you're using the default one!"
  },
  {
    keywords: ["thank", "thanks", "thank you", "o se", "o ṣe", "a dupe", "merci"],
    answer: "K\u00f3 t\u00f3p\u00e9! (You're welcome!) \u00c0 d\u1eb9\u0301 o \u2014 see you later. If you need anything else, I'm always here. \u1eb8 d\u00e1b\u1ecd\u0300!"
  },
  {
    keywords: ["bye", "goodbye", "see you", "exit", "quit", "da bo", "odabo"],
    answer: "O d\u00e1b\u1ecd\u0300! (Goodbye!) It was nice helping you. If you ever need assistance again, just click on my icon. \u1eb8 d\u00e1b\u1ecd\u0300 o, \u1ecdl\u00e1 \u00e0 t\u00fa \u1e63e!"
  },
  {
    keywords: ["yoruba", "translate", "tumo", "yoruba language", "so yoruba"],
    answer: "Mo gb\u00e9 Yor\u00f9b\u00e1 d\u00e0! (I speak Yoruba a little!) I'm designed with a Yoruba identity \u2014 my name Adunni means 'sweet one' in Yoruba. While I respond mainly in English with Yoruba greetings and phrases, our platform and our community are proudly Yoruba. \u00c8d\u00e8 Yor\u00f9b\u00e1 \u00e0ti \u00e0s\u00e0 wa ni a gb\u00e9ga!"
  },
  {
    keywords: ["privacy", "gdpr", "data", "personal", "private", "security", "ndpr", "nigeria data"],
    answer: "Your privacy is important! Here's how I protect you:\n\n\ud83d\udd12 I do not store any chat history or personal information\n\ud83d\udd12 All conversations are temporary and disappear when you leave\n\ud83d\udd12 I comply with GDPR and Nigeria Data Protection Regulation (NDPR)\n\ud83d\udd12 I never share your data with third parties\n\ud83d\udd12 Voice processing happens entirely in your browser\n\nYour data stays yours! \u00c0k\u00f3\u0300d\u00e1l\u1eb9\u0301!"
  },
  {
    keywords: ["home", "homepage", "landing", "front page", "start"],
    answer: "The homepage (/) welcomes you with our school crest, live alumni name ticker, upcoming events, and latest news. You can navigate to any section using the header menu. \u1eb8 k\u00e1\u00e0b\u1ecd\u0301 s\u00ed il\u1eb9\u0301!"
  },
  {
    keywords: ["admin", "administrator", "super admin", "manage", "management"],
    answer: "The Admin Panel (/admin) is for authorized administrators and super admins. From there they can: manage users and roles, create meetings and track attendance, handle payments and confirmations, manage election positions and aspirants, publish news, and control results visibility."
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
    return { answer: "Sorry, I didn't catch that. Could you please say that again? (Ma binu, n k\u00f2 gb\u1ecd́ ohun t\u00ed o s\u1ecd. \u1e62e \u00e0t\u1ee5ny\u1eb9\u0300w\u00e0?)", score: 0 };
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
      answer: "Ma binu (I'm sorry), I can only answer questions about the SJMUSSO '07 Alumni platform \u2014 things like registration, voting, attendance, payments, navigation, and the school. Could you please rephrase your question? \u1e62e \u00e0t\u1ee5ny\u1eb9\u0300w\u00e0 b\u1eb9\u0301\u1eb9\u0301?",
      score: 0,
    };
  }

  return bestMatch;
}
