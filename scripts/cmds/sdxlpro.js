const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

module.exports.config = {
  name: "sdxlpro",
  aliases:["sdpro"],
  version: "1.1",
  role: 0,
  author: "xrotick🥀",
  description: "Generate 4 AI image variants using FluxUltra & show with reply option",
  category: "img-gen",
  guide: "{pn} [prompt]\nExample: {pn} a cute dog with sunglasses",
  countDown: 15,
};

module.exports.onStart = async ({ event, args, api }) => {
  const apiUrl = "https://www.noobs-apis.run.place/nazrul/sdxl";
  const promptInput = args.join(" ");

  if (!promptInput) {
    return api.sendMessage("Please provide a prompt.\nExample: sdxlpro a dragon in space", event.threadID, event.messageID);
  }

  const basePrompt = `, ${promptInput}`;
  const variants = [
    `8k ultra realistic, ${basePrompt}, variation 1`,
    `4k depth of field, ${basePrompt}, variation 2`,
    `4k masterpiece, ${basePrompt}, variation 3`,
    `4k volumetric light, ${basePrompt}, variation 4`
  ];

  const imagePaths = [];
  const labels = ["u1", "u2", "u3", "u4"];
  const waitMsg = await api.sendMessage("Generating 4 image variants, please wait...", event.threadID);

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
      body: "Here Is Your SDXLPRO.\n\nReply with U1,U2,U3,Ro, U4`",
      attachment: fs.createReadStream(collagePath)
    }, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "sdxl",
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
