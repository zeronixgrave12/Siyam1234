const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const { getStreamFromURL, shortenURL } = global.utils;

const Api = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "imaginev2",
    aliases: ["iv","imgv"],
    version: "1.6.9",
    role: 0,
    author: "Nazrul",
    description: "Generate unique AI images",
    category: "ai",
    guide: "{pn} <prompt>"
  },

  onStart: async function ({ message, event, args, api }) {
    if (!args.length) return message.reply("🛠️ Provide a prompt!");

    const waitMsg = await api.sendMessage("🦆 Creating.. image please wait to complete!", event.threadID);
    try {
      const { data } = await axios.get(`${await Api()}/nazrul/imaginev2?prompt=${encodeURIComponent(args.join(" "))}`);
      if (!data?.output || data.output.length !== 4) throw "error🦆💨.";

      const imageUrls = data.output.map(img => img.url);
      const gridImagePath = await createGridImage(imageUrls);
      api.unsendMessage(waitMsg.messageID);

      message.reply(
        { body: "🍓 Completed reply with 1, 2, 3, or 4 to select an image.", attachment: fs.createReadStream(gridImagePath) },
        (err, info) => global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, author: event.senderID, imageUrls })
      );

      setTimeout(() => fs.unlinkSync(gridImagePath), 30000);
    } catch (err) {
      api.unsendMessage(waitMsg.messageID);
      message.reply(typeof err === "string" ? err : "error🦆💨.");
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    if (event.senderID !== Reply.author) return;
    const choice = parseInt(args[0]);
    if (choice < 1 || choice > 4) return message.reply("🦆 Reply with 1, 2, 3, or 4.");

    const img = Reply.imageUrls[choice - 1];
    message.reply({
      body: `🦆 Here's Your Selected Image! \n🛠️ ${await shortenURL(img)}`,
      attachment: await getStreamFromURL(img, `fluxpro_${choice}.jpeg`)
    });
  }
};

async function createGridImage(urls) {
  const images = await Promise.all(urls.map(loadImage));
  const [w, h] = [images[0].width, images[0].height];
  const canvas = createCanvas(w * 2, h * 2), ctx = canvas.getContext("2d");

  images.forEach((img, i) => ctx.drawImage(img, (i % 2) * w, Math.floor(i / 2) * h));
  
  const filePath = path.join(__dirname, `fluxpro_grid_${Date.now()}.jpeg`);
  fs.writeFileSync(filePath, canvas.toBuffer("image/jpeg"));
  return filePath;
}
