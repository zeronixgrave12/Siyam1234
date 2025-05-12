const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

module.exports.config = {
  name: "sdxlpro",
  version: "1.1",
  role: 0,
  author: "xrotick🥀 ",
  description: "Generate AI image variants using FluxUltra & show with reply option",
  category: "img-gen",
  guide: "{pn} [prompt]\nExample: {pn} sdxlpro a cute dog with sunglasses",
  countDown: 15,
};

module.exports.onStart = async ({ event, args, api }) => {
  const apiUrl = "https://zaikyoov3.koyeb.app/api/sdxl-lightning";
  const promptInput = args.join(" ");
  
  if (!promptInput) {
    return api.sendMessage("Please provide a prompt.\nExample: sdxl a dragon in space", event.threadID, event.messageID);
  }
  
  const basePrompt = `8k quality, ${promptInput}`;
  const variants = [
    `${basePrompt}, variation 1`,
    `${basePrompt}, variation 2`,
    ` ${basePrompt}, variation 3`,
    `${basePrompt}, variation 4`
  ];
  
  const imagePaths = [];
  const labels = ["u1", "u2", "u3", "u4"];
  const waitMsg = await api.sendMessage("Generating Your Image, please wait...⏳", event.threadID);
  
  try {
    for (let i = 0; i < variants.length; i++) {
      const res = await axios({
        url: `${apiUrl}?prompt=${encodeURIComponent(variants[i])}`,
        method: "GET",
        responseType: "stream"
      });
      
      const imgPath = path.join(__dirname, "cache", `${labels[i]}.png`);
      const writer = fs.createWriteStream(imgPath);
      res.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      
      imagePaths.push(imgPath);
    }
    
    
    const collagePath = path.join(__dirname, "cache", `collage_${Date.now()}.png`);
    const imageBuffers = await Promise.all(imagePaths.map(p => sharp(p).resize(512, 512).toBuffer()));
    
    const finalCollage = await sharp({
        create: {
          width: 1024,
          height: 1024,
          channels: 3,
          background: "#000"
        }
      })
      .composite([
        { input: imageBuffers[0], left: 0, top: 0 },
        { input: imageBuffers[1], left: 512, top: 0 },
        { input: imageBuffers[2], left: 0, top: 512 },
        { input: imageBuffers[3], left: 512, top: 512 },
      ])
      .png()
      .toFile(collagePath);
    
    api.sendMessage({
      body: "Here is your collage.\n\nReply with `U1`, `U2`, `U3`, or `U4` 😮‍💨",
      attachment: fs.createReadStream(collagePath)
    }, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "sdxlpro",
          messageID: info.messageID,
          imagePaths,
          author: event.senderID
        });
      }
      fs.unlinkSync(collagePath);
      api.unsendMessage(waitMsg.messageID);
    });
    
  } catch (err) {
    console.error("Image generation error:", err);
    api.sendMessage("Failed to generate images. Try again later.", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ event, api, Reply }) => {
  const { author, imagePaths } = Reply;
  const replyText = event.body.toLowerCase();
  if (event.senderID !== author) return;
  
  const labelIndex = { u1: 0, u2: 1, u3: 2, u4: 3 };
  if (!labelIndex.hasOwnProperty(replyText)) {
    return api.sendMessage("Please reply with one of the following: u1, u2, u3, u4", event.threadID, event.messageID);
  }
  
  const index = labelIndex[replyText];
  const imgStream = fs.createReadStream(imagePaths[index]);
  
  api.sendMessage({
    body: `Here is variant ${replyText.toUpperCase()}:`,
    attachment: imgStream
  }, event.threadID, event.messageID);
};
