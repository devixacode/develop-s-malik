/* =====================================================================
   ✏️  content.js — ALL THE TEXT YOU MAY WANT TO EDIT LIVES HERE
   ---------------------------------------------------------------------
   • {him} = your friend's name  ("My Demon" by default, typed on the login screen)
   • {me}  = your own name       (typed on the login screen)
   • Keep the quotes "…" and the commas , around each text.
   • Emojis are welcome — just paste them in.
   • Photo captions (Page 2) and timeline stories (Page 5) are edited
     directly inside index.html (look for the ✏️ comments there).
   ===================================================================== */

window.CONTENT = {

  /* ───────────── 💌 PAGE 3 — THE LETTER ─────────────
     Each line below is ONE paragraph of the letter.
     Add, remove or rewrite paragraphs freely.                        */
  letter: [
    "Dear {him}, on your special day, I want you to know how much happiness you bring into my life… 😈💛",

    "Finally it's your birthday, {him} 🥳 Allah g tumhein hamesha khush rkhy 😍 seht or lmbi zndgii ata frmaye 🤲🏻 hr buri nzr 👀 sy bchaye. Aaaaaameeeen 🤲🏻",

    "On your birthday, I wish that Allah g bless you with good luck ✨ happiness 😍 good health and success in every walk of your life 🌟 Wishing you a very happy birthday, my attitude king 😎",

    "Allhamdullilh Allhamdullilh Allhamdullilh 🥰 I'm so lucky to have a friend like you 🫂🫶🏻 Thank you for making my days brighter ✨ with your beautiful smile 😊 You deserve all the happiness 😍 in the world, today and always.",

    "I don't know if I could finish this paragraph bcz words really can't explain how much you mean to me 🫂 but I'm so happy Allhamdullilh 🤲🏻 Allah g ne mujhe tumhara jaisa dost diya 🤝",

    "No amount of distance or tough times can break our bond 💪🏻 You are always in my mind, and I will always be there for you. Please always stay my friend 🥹",

    "Thanks for making me more meaningful, yaar 🤗 You are rare and special for me, my best friend 🌏🤝"
  ],

  // Signature at the bottom of the letter (\n = new line)
  letterSign: "Forever your friend,\n{me} 🤝",


  /* ───────────── 😈 PAGE 4 — REASONS YOU'RE AWESOME ─────────────
     icon  = emoji on the front of the card
     title = short title on the front
     text  = message revealed when the card is tapped                  */
  reasons: [
    { icon: "😊", title: "Your Smile",
      text: "Thank you for making my days brighter ✨ with your beautiful smile 😊 You deserve all the happiness 😍 in the world today and always." },

    { icon: "🌏", title: "You Mean The World",
      text: "You mean the world to me 🌏🥹 Seriously, {him}, I'm so lucky to have a friend like you." },

    { icon: "😎", title: "My Attitude King",
      text: "Nobody carries the attitude like you do, {him} 😎🔥 Never change!" },

    { icon: "✨", title: "Light of My Days",
      text: "You make every boring day shine brighter ✨ Life is just more fun with you around 🤩" },

    { icon: "🥰", title: "Alhamdulillah",
      text: "Allhamdullilh Allhamdullilh Allhamdullilh 🥰 Allah g ne mujhe tumhara jaisa dost diya 🤲🏻" },

    { icon: "💭", title: "Always In My Mind",
      text: "You are always in my mind 💛 Every happy memory I have, you're somewhere in it." },

    { icon: "💪🏻", title: "Stronger Than Distance",
      text: "No amount of distance or tough times can break our bond 🤝 I've got your back, always." },

    { icon: "🌟", title: "Rare & Special",
      text: "You are rare and special for me, my best friend 🌟 Thanks for being you, {him} 🫶🏻" }
  ],


  /* ───────────── 🎂 PAGE 7 — THE BIRTHDAY WISH ─────────────
     Shown after pressing “Make a Birthday Wish ✨”                    */
  wishIntro: "Close your eyes, {him}… and make a wish 🤲🏻✨ Here is mine for you:",

  wishes: [
    { icon: "😍", title: "Happiness",
      text: "May every single day bring you a reason to smile, my friend." },
    { icon: "✨", title: "Success",
      text: "Allah g bless you with good luck ✨ and success in every walk of your life 🌟" },
    { icon: "🤲🏻", title: "Peace",
      text: "Hr any wala din khushion or sukoon wala ho Sum Ameen 🤲🏻" },
    { icon: "🤝", title: "Friendship",
      text: "May our friendship stay strong forever. I'm always here for you 💛" }
  ],


  /* ───────────── 🧸 PAGE 6 — BEST FRIENDS CORNER ───────────── */
  // Little speech bubbles that pop up when a friends sticker is tapped
  coupleReactions: [
    "Hehe 😈", "Yaar 🤝", "Best friends 🫶🏻", "Party time 🥳", "My Demon 😈", "LOL 😂", "Forever 💛", "Legend 😎"
  ],
  // Message revealed by the surprise button
  coupleSurprise: "{him}, you are my favorite person and my best friend in this whole world 🌏 I'm so lucky to have you. Happy Birthday, yaar! 🥳🤝",


  /* ───────────── 😈 PAGE 8 — FINAL SURPRISE ───────────── */
  // The hidden message revealed by “One More Surprise 💌”
  finalSurprise: "Thank you for always being there for me 🥹 Please always stay my friend, {him}. You mean the world to me 🌏 Happy Birthday once again! 🥳😈",

  // The closing line (shown at the bottom of the last page)
  finalLine: "No matter how many birthdays come and go, I hope every one of them brings you a little more happiness. Happy Birthday, my best friend. 😈💛"
};
