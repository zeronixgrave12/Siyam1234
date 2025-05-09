const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { createCanvas, loadImage } = require("canvas");

const imageStore = {};

module.exports.config = {
  name: "dallepro",
  aliases:["dalpro"],
  version: "1.2",
  role: 0,
  author: "Xrotick + Amit Max ⚡",
  description: "Generate 4 AI images with retrieval by u1-u4",
  category: "ai",
  guide: "dallepro [prompt]\nExample: dallepro a cat in space\nThen use: u1, u2, u3, u4 to get specific image.",
  countDown: 20
};

module.exports.onStart = async function ({ event, args, api }) {
  const input = args.join(" ")?.toLowerCase().trim();
  const userKey = `${event.senderID}_${event.threadID}`;

  
  if (["u1", "u2", "u3", "u4"].includes(input)) {
    const index = parseInt(input[1]) - 1;
    const images = imageStore[userKey];
    if (!images || !images[index]) {
      return api.sendMessage("No recent image found. Please generate one first using a prompt.", event.threadID, event.messageID);
    }

    return api.sendMessage({
      body: `Here's image ${input.toUpperCase()}:`,
      attachment: fs.createReadStream(images[index])
    }, event.threadID);
  }


  const prompt = args.join(" ");
  if (!prompt) {
    return api.sendMessage("Please provide a prompt.\nExample: dallepro a cyberpunk city at night", event.threadID, event.messageID);
  }

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  try {
    const waitMsg = await api.sendMessage("Generating images. Please wait...", event.threadID);
    api.setMessageReaction("⏰", event.messageID, () => {}, true);

    const generateImage = async (index) => {
      const res = await axios.get(`https://zaikyoov3.koyeb.app/api/dalle3?prompt=${encodeURIComponent(prompt)}`, {
        responseType: "stream"
      });
      const filePath = path.join(cacheDir, `img_${Date.now()}_${index}.png`);
      const writer = fs.createWriteStream(filePath);
      await pipeline(res.data, writer);
      return filePath;
    };

    const imgPaths = await Promise.all([
      generateImage(1),
      generateImage(2),
      generateImage(3),
      generateImage(4)
    ]);

    imageStore[userKey] = imgPaths;

    
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");
    const images = await Promise.all(imgPaths.map(p => loadImage(p)));

    ctx.drawImage(images[0], 0, 0, 512, 512);
    ctx.drawImage(images[1], 512, 0, 512, 512);
    ctx.drawImage(images[2], 0, 512, 512, 512);
    ctx.drawImage(images[3], 512, 512, 512, 512);

    const finalPath = path.join(cacheDir, `final_${Date.now()}.png`);
    const out = fs.createWriteStream(finalPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise(resolve => out.on("finish", resolve));

    await api.sendMessage({
      body: `Use prefix dallepro Reply To : U1, U2, U3, U4`,
      attachment: fs.createReadStream(finalPath)
    }, event.threadID);

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.unsendMessage(waitMsg.messageID);

    // Auto delete after 10 minutes
    setTimeout(() => {
      [...imgPaths, finalPath].forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
      delete imageStore[userKey];
    }, 10 * 60 * 1000);

  } catch (err) {
    console.error("Image generation error:", err);
    api.sendMessage("Failed to generate images. Try again later.", event.threadID, event.messageID);
    api.setMessageReaction("❌", event.messageID, () => {}, true);
  }
};
