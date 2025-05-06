const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "imagine",
    version: "1.0",
    role: 0,
    author: "Amit Max ⚡",
    description: "Generate AI image using Imagine API",
    category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
    guide: "{pn} [prompt]\nExample: {pn} sunset in cyberpunk city",
    countDown: 15,
  },

  onStart: async ({ event, args, api }) => {
    const prompt = args.join(" ");
    if (!prompt)
      return api.sendMessage("⚠️ Please provide a prompt to imagine.\nExample: imagine a magical forest at night", event.threadID, event.messageID);

    const imageUrl = `https://hazeyyyy-rest-apis.onrender.com/api/imagine?prompt=${encodeURIComponent(prompt)}`;

    try {
      const waitMsg = await api.sendMessage("Generating your image, please wait...⏳", event.threadID);
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.get(imageUrl, { responseType: "stream" });

      const imgPath = path.join(__dirname, "cache", `imagine_${Date.now()}.jpg`);
      const writer = fs.createWriteStream(imgPath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        
        api.setMessageReaction("⏰", event.messageID, () => {}, true);

        api.sendMessage({
          body: `Amit Max ⚡, Here is your image for prompt: "${prompt}"`,
          attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath));

        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.unsendMessage(waitMsg.messageID);
      });

      writer.on("error", err => {
        throw new Error("❌ Error saving image.");
      });
    } catch (error) {
      console.error("❌ Imagine command error:", error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("❌ Failed to generate image. Please try again later.", event.threadID, event.messageID);
    }
  }
};
