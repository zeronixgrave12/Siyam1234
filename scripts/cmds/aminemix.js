.cmd install mixgen.js module.exports = {
  config: {
    name: "aminemix",
    aliases: ["amix", "animegen", "miximg"],
    version: "1.0",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Generate anime-style image from a prompt",
    longDescription: "Create AI-generated anime-style images using text prompts.",
    category: "ai",
    guide: {
      en: "{pn} <your prompt>\n\nExample:\n{pn} a girl with blue hair holding a sword"
    }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("Please provide a prompt to generate the image.", event.threadID, event.messageID);

    // React to the user's message with hourglass
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const url = `https://renzweb.onrender.com/api/animemix?prompt=${encodeURIComponent(prompt)}`;

    try {
      // Notify the user that image generation has started
      api.sendMessage("⏳ Generating your image, please wait...", event.threadID, event.messageID);

      const axios = require("axios");
      const fs = require("fs");
      const path = require("path");
      const res = await axios.get(url, { responseType: "arraybuffer" });

      const imagePath = path.join(__dirname, "cache", `${event.senderID}_aminemix.jpg`);
      fs.writeFileSync(imagePath, Buffer.from(res.data, "utf-8"));

      // Send the generated image
      api.sendMessage({
        body: `✨ Here's your anime-style image!\nPrompt: ${prompt}`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);

    } catch (e) {
      api.sendMessage("❌ Failed to generate image. Please try again later.", event.threadID, event.messageID);
      console.error(e);
    }
  }
};
