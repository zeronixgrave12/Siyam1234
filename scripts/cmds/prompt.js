.cmd install prompt4.js const axios = require("axios");

const apiKey = "gaysex";
const foxApi = "https://connect-foxapi.onrender.com";
const calyxApi = "https://smfahim.xyz";

function cleanPrompt(text) {
  return text.replace(/https?:\/\/[^\s]+/g, '').trim();
}

module.exports = {
  config: {
    name: "prompt",
    aliases: ["p", "p", "pro"],
    version: "2.0",
    author: "SiAM x Calyx",
    countDown: 5,
    role: 0,
    shortDescription: "Generate powerful prompts from text or image",
    longDescription: "Supports random, anime, and NSFW prompt enhancement",
    category: "ai",
    guide: {
      en: "/prompt [text/image] [--nsfw / -anime / -random]",
    },
  },

  onStart: async function ({ message, event, args }) {
    try {
      await message.reaction("⏳", event.messageID);

      let isNSFW = false;
      let imageUrl = null;
      let promptText = args.join(" ");
      let response;

      // Check for NSFW
      if (args.includes("--nsfw")) {
        isNSFW = true;
        args = args.filter(arg => arg !== "--nsfw");
        promptText = args.join(" ");
      }

      // Image from reply
      if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo") {
        imageUrl = event.messageReply.attachments[0].url;
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/i)) {
        imageUrl = args[0];
      }

      // Handle flags
      if (["-random", "-r"].includes(promptText.toLowerCase())) {
        response = await axios.get(`${calyxApi}/prompt-random`);
        return message.reply(response.data.data.prompt);
      }

      if (["-anime", "-a"].some(flag => promptText.toLowerCase().includes(flag))) {
        const input = imageUrl || promptText;
        response = await axios.get(`${calyxApi}/prompt2?url=${encodeURIComponent(input)}`);
        if (response.data.code === 200) return message.reply(response.data.data);
        return message.reply("❌ | Failed to fetch anime prompt.");
      }

      // Standard prompt generation
      let prompt;
      if (imageUrl) {
        const { data } = await axios.get(`${foxApi}/simoAI/getPrompt?imageUrl=${encodeURIComponent(imageUrl)}&type=image&apikey=${apiKey}`);
        if (!data.success) return message.reply("❌ প্রম্পট তৈরি ব্যর্থ হয়েছে।");
        prompt = cleanPrompt(data.prompt);
      } else if (promptText) {
        const { data } = await axios.get(`${foxApi}/simoAI/getPrompt?prompt=${encodeURIComponent(promptText)}&type=text&apikey=${apiKey}`);
        if (!data.success) return message.reply("❌ প্রম্পট তৈরি ব্যর্থ হয়েছে।");
        prompt = cleanPrompt(data.prompt);
      } else {
        return message.reply("⚠️ ছবি রিপ্লাই করো, ইমেজ লিংক দাও অথবা টেক্সট দাও প্রম্পট তৈরির জন্য।");
      }

      // Enhance
      if (isNSFW) {
        prompt += ", extremely detailed, erotic composition, sensual atmosphere, soft curves, intimate lighting, NSFW style";
      } else {
        prompt += ", ultra-detailed, 8k render, cinematic lighting, vibrant colors";
      }

      await message.reaction("✅", event.messageID);
      return message.reply(prompt);

    } catch (err) {
      console.error("Prompt error:", err.message || err);
      await message.reaction("❌", event.messageID);
      return message.reply("⚠️ কিছু একটা সমস্যা হয়েছে।");
    }
  }
};
