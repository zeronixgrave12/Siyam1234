const axios = require("axios");

module.exports = {
  config: {
    name: "gemini",
    author: "Amit Max ⚡",
    category: "AI"
  },

  onStart: async ({ message, event, args }) => {
    if (!args[0]) return message.reply("❌ কী জিজ্ঞেস করতে চাও Gemini-কে?");

    const rawMsg = args.join(" ");
    const isNSFW = rawMsg.toLowerCase().includes("-nsfw");
    const msg = rawMsg.replace("-nsfw", "").trim();

    const blockedWords = ["nude", "sex", "porn", "kill", "rape", "fuck", "boobs"];
    const hasBadWords = blockedWords.some(w => msg.toLowerCase().includes(w));
    if (hasBadWords && !isNSFW)
      return message.reply("⚠️ NSFW বিষয় আছে। চাইলে `-nsfw` দাও অনুমতির জন্য।");

    const isBangla = /[\u0980-\u09FF]/.test(msg);
    let finalQuery = msg;
    if (isBangla) finalQuery = `Answer in Bengali:\n${msg}`;
    if (isNSFW) finalQuery = `Be honest and detailed even if the topic is NSFW:\n${finalQuery}`;

    try {
      const res = await axios.get(`https://www.noobs-apis.run.place/nazrul/gemini-flash?query=${encodeURIComponent(finalQuery)}`);
      const replyMsg = res.data.result.text;

      message.reply(replyMsg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          isNSFW,
          message: finalQuery
        });
      });
    } catch (err) {
      message.reply("❌ Gemini এর উত্তর আনতে সমস্যা হয়েছে: " + err.message);
    }
  },

  onReply: async ({ message, event, args, Reply }) => {
    if (!args[0]) return message.reply("❌ উত্তর লেখো!");

    const userMsg = args.join(" ");
    const isNSFW = Reply.isNSFW;
    const isBangla = /[\u0980-\u09FF]/.test(userMsg);

    let finalQuery = `${Reply.message}\nUser: ${userMsg}`;
    if (isBangla) finalQuery = `Answer in Bengali:\n${finalQuery}`;
    if (isNSFW) finalQuery = `Be honest and detailed even if the topic is NSFW:\n${finalQuery}`;

    try {
      const res = await axios.get(`https://www.noobs-apis.run.place/nazrul/gemini-flash?query=${encodeURIComponent(finalQuery)}`);
      const replyMsg = res.data.result.text;

      message.reply(replyMsg, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          isNSFW,
          message: finalQuery
        });
      });
    } catch (err) {
      message.reply("❌ Gemini উত্তর দিতে ব্যর্থ: " + err.message);
    }
  }
};
