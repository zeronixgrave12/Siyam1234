const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");

module.exports.config = {
  name: "dalle3",
  aliases:["dal3"],
  version: "1.2",
  role: 0,
  author: "xrotick🥀",
  description: "Generate AI image using FluxUltra",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  guide: "{pn} [prompt]\nExample: {pn} a cute dog with sunglasses",
  countDown: 15,
};

module.exports.onStart = async ({ event, args, api }) => {
  const apiUrl = "https://zaikyoov3.koyeb.app/api/dalle3";
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage("Please provide a prompt.\nExample: fa a dragon in space", event.threadID, event.messageID);
  }

  try {
    const waitMsg = await api.sendMessage("Generating your image, please wait...", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(prompt)}`, {
      responseType: "stream"
    });

    // Ensure the cache folder exists
    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    const imgPath = path.join(cachePath, `flux_${Date.now()}.png`);
    const writer = fs.createWriteStream(imgPath);

    // Wait for the stream to finish using pipeline
    await pipeline(response.data, writer);

    await api.sendMessage({
      body: `Here is your AI-generated image for: "${prompt}"`,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.unsendMessage(waitMsg.messageID);

  } catch (err) {
    console.error("Image generation error:", err.message || err);
    api.sendMessage("Failed to generate image. Try again later.", event.threadID, event.messageID);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};
