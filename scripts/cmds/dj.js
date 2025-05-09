const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const Jimp = require("jimp");  

module.exports = {
  config: {
    name: "dj",
    version: "1.0",
    author: "Amit Max ⚡+ xrotick🥀",//Amit max ⚡ and xrotick🥀 author 
    countDown: 10,
    role: 0,
    shortDescription: "Generate 4 AI images and combine them into one",
    longDescription: "Generates 4 images and combines them into a single image in a 2x2 grid.",
    category: "ai",
    guide: "{pn} <prompt>\nExample: {pn} futuristic city"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt)
      return api.sendMessage("Please provide a prompt.\nExample: dj futuristic city", event.threadID, event.messageID);

    const waitMsg = await api.sendMessage("Generating Your images, please wait...⏳", event.threadID, event.messageID);

    try {
      const res = await axios.get("https://renzweb.onrender.com/api/mj-proxy-pub", {
        params: {
          prompt,
          key: "free_key"
        }
      });

      const results = res.data?.results;
      if (!results || results.length !== 4) {
        return api.sendMessage("API did not return 4 images.", event.threadID, waitMsg.messageID);
      }

      const imagePaths = [];

      
      for (let i = 0; i < results.length; i++) {
        const url = results[i];
        const filePath = path.join(__dirname, `cache/f9_${event.senderID}_${i}.jpg`);
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));
        imagePaths.push(filePath);
      }

    
      const combinedImagePath = path.join(__dirname, `cache/f9_combined_${event.senderID}.jpg`);
      const image1 = await Jimp.read(imagePaths[0]);
      const image2 = await Jimp.read(imagePaths[1]);
      const image3 = await Jimp.read(imagePaths[2]);
      const image4 = await Jimp.read(imagePaths[3]);

      const width = 400;
      const height = 400;
      image1.resize(width, height);
      image2.resize(width, height);
      image3.resize(width, height);
      image4.resize(width, height);

      const combinedImage = new Jimp(width * 2, height * 2, 0xFFFFFFFF);

      combinedImage.composite(image1, 0, 0);
      combinedImage.composite(image2, width, 0);
      combinedImage.composite(image3, 0, height);
      combinedImage.composite(image4, width, height);

      await combinedImage.writeAsync(combinedImagePath);

      api.sendMessage({
        body: `Reply Your Image: U1, U2, U3, U4`,
        attachment: fs.createReadStream(combinedImagePath)
      }, event.threadID, (err, info) => {
        if (err) console.error("Send error:", err);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: "f9",
          author: event.senderID,
          images: results
        });

        setTimeout(() => {
          imagePaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
          fs.existsSync(combinedImagePath) && fs.unlinkSync(combinedImagePath);
        }, 60 * 1000);
      }, waitMsg.messageID);

    } catch (err) {
      console.error("Image generation error:", err?.response?.data || err);
      return api.sendMessage("Image generation failed. Try again later.", event.threadID, waitMsg.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const input = event.body.trim().toUpperCase();
    const index = { U1: 0, U2: 1, U3: 2, U4: 3 }[input];

    if (index === undefined)
      return api.sendMessage("Invalid option. Use: U1, U2, U3, or U4.", event.threadID, event.messageID);

    try {
      const url = Reply.images[index];
      const tempFile = path.join(__dirname, `cache/f9_select_${event.senderID}.jpg`);
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(tempFile, Buffer.from(response.data, "binary"));

      api.sendMessage({
        body: `⏳ Here is your selected image (${input})`,
        attachment: fs.createReadStream(tempFile)
      }, event.threadID, () => {
        fs.existsSync(tempFile) && fs.unlinkSync(tempFile);
      });

    } catch (err) {
      console.error("Send error:", err);
      api.sendMessage("Failed to send the selected image.", event.threadID, event.messageID);
    }
  }
};
