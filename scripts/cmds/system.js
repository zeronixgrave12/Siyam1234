const si = require('systeminformation');
const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "system",
    aliases: ["sys"],
    version: "1.1",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "System Information",
    longDescription: "",
    category: "system",
    guide: "{pn}"
  },

  byte2mb: function (bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
  },

  onStart: async function ({ api, event }) {
    try {
      const timeStart = Date.now();

      // System Information
      const { cpu, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo, networkInterfaces, system, graphics, battery, wifiNetworks, users } = si;

      const cpuInfo = await cpu();
      const cpuTemp = await cpuTemperature();
      const loadInfo = await currentLoad();
      const diskInfo = await diskLayout();
      const memoryInfo = await mem();
      const networkInfo = await networkInterfaces();
      const graphicsInfo = await graphics();
      const batteryInfo = await battery();
      const wifiInfo = await wifiNetworks();
      const usersInfo = await users();
      const { hostname, platform: systemPlatform, arch } = await system();
      const { version, distro } = await osInfo();

      // Local Time Dhaka
      const dhakaTime = moment().tz('Asia/Dhaka');
      const currentTime = dhakaTime.format('hh:mm:ss A');

      // Uptime
      let time = process.uptime();
      let hours = Math.floor(time / 3600).toString().padStart(2, '0');
      let minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
      let seconds = Math.floor(time % 60).toString().padStart(2, '0');

      let response = `𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼:
🖥 𝗖𝗽𝗨: ${cpuInfo.manufacturer} ${cpuInfo.brand} - ${cpuInfo.speed}GHz
🔥 𝗖𝗽𝗨 𝗧𝗲𝗺𝗽: ${cpuTemp.main}°C
⚡ 𝗖𝗽𝗨 𝗟𝗼𝗮𝗱: ${loadInfo.currentLoad.toFixed(1)}%

💾 𝗠𝗲𝗺𝗼𝗿𝘆:
🔹 Total: ${this.byte2mb(memoryInfo.total)}
🔹 Used: ${this.byte2mb(memoryInfo.used)}
🔹 Usage: ${memoryInfo.active.toFixed(1)}%

🖥 𝗢𝗦:
📌 Platform: ${systemPlatform}
📀 Version: ${version} ${distro}
🖥 CPU Cores: ${cpuInfo.physicalCores}
📀 Disk Usage: ${this.byte2mb(diskInfo[0]?.size || 0)}

🌐 Network:
🔹 Interfaces: ${networkInfo.length}
🔹 Public IP: ${networkInfo[0]?.ip4 || "N/A"}
🔹 Speed: ${networkInfo[0]?.speed || "N/A"} Mbps

🎮 Graphics Info: ${graphicsInfo.controllers.length > 0 ? graphicsInfo.controllers[0].model : 'No graphics'}
🎮 GPU Usage: ${graphicsInfo.controllers.length > 0 ? graphicsInfo.controllers[0].memoryUsed : 'No GPU used'}

🔋 Battery Info: ${batteryInfo.hasbattery ? `${batteryInfo.percent}%` : 'No battery detected'}

📶 WiFi Networks: ${wifiInfo.length}

👥 Users Logged In: ${usersInfo.length}

🕒 Uptime: ${hours}:${minutes}:${seconds}
⏰ Local Time : ${currentTime}
⏳ Ping: ${(Date.now() - timeStart)}ms`;

      // Random Image
      const imageLinks = [
        "https://i.imgur.com/dMmTo9C.jpeg",
        "https://i.imgur.com/j1EFkoO.jpeg",
        "https://i.imgur.com/2W1Olpo.jpeg",
        "https://i.imgur.com/GOtplM8.jpeg",
        "https://i.imgur.com/rSps1FI.jpeg",
        "https://i.imgur.com/bH93IxF.jpeg",
        "https://i.imgur.com/FohUXKK.jpeg",
"https://i.imgur.com/WB2q6a6.jpeg",
"https://i.imgur.com/Y9d17R3.jpeg",
"https://i.imgur.com/RFECwDo.jpeg",
"https://i.imgur.com/NPasXzw.jpeg",
"https://i.imgur.com/NPasXzw.jpeg",
"https://i.imgur.com/ossbykT.jpeg",
"https://i.imgur.com/cGzlaHU.jpeg",
"https://i.imgur.com/OkslSRP.png",
"https://i.imgur.com/IG00E9x.png",
"https://i.imgur.com/BbQ59jR.jpeg",
"https://i.imgur.com/r0AJLsQ.jpeg",
"https://i.imgur.com/8xjwuMG.jpeg",
"https://i.imgur.com/K4gyMT6.jpeg",
"https://i.imgur.com/vSvVQpd.jpeg",
      ];

      const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
      const imagePath = __dirname + "/cache/system_info.jpg";

      // Download image and send message
      request(encodeURI(randomImage)).pipe(fs.createWriteStream(imagePath)).on("close", () => {
        api.sendMessage({ body: response, attachment: fs.createReadStream(imagePath) }, event.threadID, () => {
          fs.unlinkSync(imagePath);
        }, event.messageID);
      });

    } catch (e) {
      console.error(e);
      api.sendMessage("❌ সিস্টেম তথ্য আনতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
