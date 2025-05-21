const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

function parseArgs(text) {
  const prompt = text.replace(/--[a-z]+\s*\S*/gi, "").trim();
  return { prompt };
}

module.exports = {
  config: {
    name: "mj2",
    aliases:["midjourney2"],
    version: "3.6",
    author: "Amit Max ⚡",
    role: 2,
    shortDescription: "Generate images with MidJourney",
    longDescription: "Generates 4 images using MidJourney, then allows selecting U1–U4",
    category: "ai",
    guide: `{pn} <prompt> [--ar W:H] [--v7] [--niji6]
Examples:
{pn} warrior elf --ar 3:2
{pn} anime fox girl --niji6`
  },

  onStart: async function ({ api, event, args }) {
    const rawPrompt = args.join(" ");
    if (!rawPrompt)
      return api.sendMessage(
        "Enter a prompt.\nExample: mj2 cyberpunk samurai --ar 16:9",
        event.threadID,
        event.messageID
      );

    const { prompt } = parseArgs(rawPrompt);
    const uid = event.senderID;
    const waitMsg = await api.sendMessage(`MidJourney is generating ⏳\n🆔 ${uid}`, event.threadID, event.messageID);

    try {
      // এখানে তোমার নতুন API URL ও query param দিলাম
      const res = await axios.get("https://zaikyoov3-up.up.railway.app/api/mjproxy5", {
        params: { prompt: rawPrompt, usePolling: false }
      });

      // তোমার API response যেভাবে আসবে, সেটা ধরলাম:
      // {
      //   status: "completed",
      //   urls: [ "url1", "url2", "url3", "url4" ]
      // }
      const data = res.data;

      if (data.status !== "completed" || !Array.isArray(data.urls) || data.urls.length !== 4) {
        return api.sendMessage("Error: The API did not return 4 images.", event.threadID, waitMsg.messageID);
      }

      const filePaths = [];

      for (let i = 0; i < data.urls.length; i++) {
        const filePath = path.join(__dirname, `cache/mj_${uid}_${i}.jpg`);
        const imgRes = await axios.get(data.urls[i], { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(imgRes.data, "binary"));
        filePaths.push(filePath);
      }

      // 1024x1024 ক্যানভাসে 4 ছবি কোলাজ করা (512x512 চারটে)
      const canvas = createCanvas(1024, 1024);
      const ctx = canvas.getContext("2d");

      const img1 = await loadImage(filePaths[0]);
      const img2 = await loadImage(filePaths[1]);
      const img3 = await loadImage(filePaths[2]);
      const img4 = await loadImage(filePaths[3]);

      ctx.drawImage(img1, 0, 0, 512, 512);
      ctx.drawImage(img2, 512, 0, 512, 512);
      ctx.drawImage(img3, 0, 512, 512, 512);
      ctx.drawImage(img4, 512, 512, 512, 512);

      const outPath = path.join(__dirname, `cache/mj_combined_${uid}.jpg`);
      const outStream = fs.createWriteStream(outPath);
      const stream = canvas.createJPEGStream();
      stream.pipe(outStream);

      outStream.on("finish", () => {
        api.sendMessage(
          {
            body: `Reply with:\nU1 – Top Left\nU2 – Top Right\nU3 – Bottom Left\nU4 – Bottom Right`,
            attachment: fs.createReadStream(outPath)
          },
          event.threadID,
          (err, info) => {
            if (err) console.error("Send error:", err);

            global.GoatBot.onReply.set(info.messageID, {
              commandName: "mj2",
              author: uid,
              images: data.urls
            });

            // 60 সেকেন্ড পরে ফাইল ডিলিট
            setTimeout(() => {
              [...filePaths, outPath].forEach((p) => fs.existsSync(p) && fs.unlinkSync(p));
            }, 60000);
          },
          waitMsg.messageID
        );
      });
    } catch (err) {
      console.error("Generation error:", err?.response?.data || err);
      return api.sendMessage("Generation failed. Please try again later.", event.threadID, waitMsg.messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const input = event.body.trim().toUpperCase();
    const index = { U1: 0, U2: 1, U3: 2, U4: 3 }[input];

    if (index === undefined)
      return api.sendMessage("Action ❏ U1, U2, U3, U4", event.threadID, event.messageID);

    try {
      const url = Reply.images[index];
      const tempFile = path.join(__dirname, `cache/mj_select_${event.senderID}.jpg`);
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(tempFile, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `Here is your selected image (${input})`,
          attachment: fs.createReadStream(tempFile)
        },
        event.threadID,
        () => fs.existsSync(tempFile) && fs.unlinkSync(tempFile)
      );
    } catch (err) {
      console.error("Send error:", err);
      api.sendMessage("Failed to send the image.", event.threadID, event.messageID);
    }
  }
};
