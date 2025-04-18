const axios = require("axios");

const BASE_API = "https://mahmud-age.onrender.com";

module.exports = {
  config: {
    name: "age",
    version: "1.3",
    author: "Mahmud x Amit Max ⚡",
    category: "utility",
    guide: {
      en: "Usage: age <YYYY-MM-DD> [font1|font2|font3]\nExample: age 2000-04-18 font2"
    }
  },

  onStart: async function ({ args, message }) {
    if (!args[0]) {
      return message.reply("❗ ভাই, জন্মতারিখ না দিলে আমি কেমনে হিসাব করবো? দাও এইভাবে: `YYYY-MM-DD`");
    }

    const inputDate = args[0];
    const validFormat = /^\d{4}-\d{2}-\d{2}$/;

    if (!validFormat.test(inputDate)) {
      return message.reply("⚠️ ভাই, ফরম্যাট ভুল দিছো! সোজা করে দাও: `YYYY-MM-DD`");
    }

    const fontStyle = args[1] || "font3";

    try {
      const response = await axios.get(`${BASE_API}/age/${fontStyle}/${inputDate}`);
      const data = response.data;

      if (data.error) {
        return message.reply(`❌ ওফ! সমস্যা হইছে: ${data.error}`);
      }

      let extraFacts = `
🧮 Extra Facts:
- Days: ${data.days}
- Weeks: ${data.weeks}
- Months: ${data.months}
- Hours: ${data.hours}
- Minutes: ${data.minutes}
- Seconds: ${data.seconds}
`;

      return message.reply(`✅ হিসাব অনুযায়ী:\n${data.message}\n${extraFacts}`);

    } catch (error) {
      console.error("Age API error:", error.message);
      return message.reply("❌ ঐ দ্যাখো! সার্ভার কই যায় নাই। একটু পর আবার চেষ্টা করো ভাই।");
    }
  }
};
