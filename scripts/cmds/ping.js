const fs = require("fs");
const path = require("path");
const https = require("https");

const imageUrl = "https://i.imgur.com/IJKQddM.jpeg";
const localPath = path.join(__dirname, "ping_image.jpg");

module.exports = {
  config: {
    name: "ping",
    version: "1.0",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Check bot speed!",
    longDescription: "Check bot response & uptime with a cute image.",
    category: "Utility",
  },

  onStart: async () => {},

  onChat: async function ({ event, message, api }) {
    if ((event.body || "").toLowerCase() === "ping") {
      const start = Date.now();
      const systemUptime = process.uptime(); // in seconds
      const botUptime = global.botStartTime
        ? Math.floor((Date.now() - global.botStartTime) / 1000)
        : systemUptime;

      // Download image
      const file = fs.createWriteStream(localPath);
      https.get(imageUrl, (response) => {
        response.pipe(file);
        file.on("finish", async () => {
          const ping = Date.now() - start;
          const uptimeStr = formatTime(botUptime);

          const userInfo = await api.getUserInfo(event.senderID);
          const name = userInfo[event.senderID]?.name || "User";

          const body = `
╭━━━⌈ ✨  𝙿𝙸𝙽𝙶  ✨ ⌋━━━╮

⏳ 𝙿𝙸𝙽𝙶 𝚃𝙸𝙼𝙴: ${ping}ms
⏰ 𝚄𝙿𝚃𝙸𝙼𝙴: ${uptimeStr}

🧸 𝚁𝙴𝚀: @${name}

╰━━━━━━━━━•••━━━━━━━━╯
          `.trim();

          return message.reply({
            body,
            attachment: fs.createReadStream(localPath),
            mentions: [{
              tag: `@${name}`,
              id: event.senderID
            }]
          });
        });
      });
    }
  },
};

function formatTime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}
