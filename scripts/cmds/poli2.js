const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "poli2",
  version: "1.2",
  role: 0,
  author: "Amit Max ⚡",
  description: "Generate AI image using FluxUltra",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  guide: "{pn} [prompt]\nExample: {pn} futuristic city skyline",
  countDown: 15,
};

module.exports.onStart = async ({ event, args, api }) => {
  const apiUrl = "https://hazeyyyy-rest-apis.onrender.com/api/poli1";
  const userPrompt = args.join(" ");

  if (!userPrompt) {
    return api.sendMessage("Please provide a prompt.\nExample: poli1 a dragon in space", event.threadID, event.messageID);
  }

  const prompt = `4k quality, ultra high definition, 1:1 ratio, ${userPrompt}`; // "HD" এর পরিবর্তে "4k quality" ব্যবহার করা হয়েছে

  try {
    const waitMsg = await api.sendMessage("Generating your image, please wait...", event.threadID);
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const response = await axios({
      url: `${apiUrl}?prompt=${encodeURIComponent(prompt)}`,
      method: "GET",
      responseType: "stream"
    });

    const imgPath = path.join(__dirname, "cache", `poli2_${Date.now()}.png`);
    const writer = fs.createWriteStream(imgPath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `Here is your AI-generated image for: "${userPrompt}" (4k, ultra high definition)`,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath));

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      api.unsendMessage(waitMsg.messageID);
    });

    writer.on("error", err => {
      throw new Error("Error saving image stream.");
    });
  } catch (err) {
    console.error("Error in poli2 command:", err);
    api.sendMessage("Failed to generate image. Please try again later.", event.threadID, event.messageID);
  }
};
