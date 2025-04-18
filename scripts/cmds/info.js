const axios = require("axios");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "myinfo",
    aliases: ["info", "owenr"],
    version: "2.3",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show personal profile info" },
    longDescription: { en: "Display your personal profile with image and video" },
    category: "info",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    const currentTime = moment().tz("Asia/Dhaka").format("hh:mm A");

    const info = `
『 ᴀᴍɪᴛ ᴍᴀx ⚡ ᴘʀᴏꜰɪʟᴇ 』

👤 ɴᴀᴍᴇ: ᴀᴍɪᴛ ᴍᴀx ⚡  
🆔 ꜰᴀᴄᴇʙᴏᴏᴋ: fb.com/share/1564YX2VyT  
📸 ɪɴꜱᴛᴀɢʀᴀᴍ: instagram.com/amitmax44  
✉️ ᴇᴍᴀɪʟ: maxamit279@gmail.com  
📍 ʟᴏᴄᴀᴛɪᴏɴ: ᴅʜᴀᴋᴀ, ʙᴀɴɢʟᴀᴅᴇꜱʜ  
🎓 ᴄʟᴀꜱꜱ: ᴄᴏʟʟᴇɢᴇ ꜱᴛᴜᴅᴇɴᴛ  
🛐 ʀᴇʟɪɢɪᴏɴ: ꜱᴀɴᴀᴛᴀɴ  
💘 ʀᴇʟᴀᴛɪᴏɴꜱʜɪᴘ: ꜱɪɴɢʟᴇ  
🩸 ʙʟᴏᴏᴅ ɢʀᴏᴜᴘ: ʙ+  
🎂 ʙɪʀᴛʜᴅᴀʏ: 18 ᴍᴀʏ 2006  
🎮 ʜᴏʙʙɪᴇꜱ: ᴄᴏᴅɪɴɢ, ɢᴀᴍɪɴɢ, ᴀɪ ᴇxᴘʟᴏʀᴇ  
⏰ ᴛɪᴍᴇ: ${currentTime}
`;

    const videoUrl = "https://i.imgur.com/KoYBHnM.mp4";
    const tmpFolder = path.join(__dirname, "tmp");
    if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder);

    const videoPath = path.join(tmpFolder, "owner.mp4");

    try {
      const video = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(video.data, "binary"));

      message.reply({
        body: info,
        attachment: fs.createReadStream(videoPath)
      });
    } catch {
      // যদি ভিডিও লোড না হয়, শুধু টেক্সট পাঠাও
      message.reply(info);
    }
  },

  onChat: async function ({ message }) {
    const triggerWords = ["info", "owenr", "bot owenr"];
    const lower = message.body?.toLowerCase() || "";

    if (triggerWords.some(word => lower.includes(word))) {
      message.react("😘");
    }
  }
};
