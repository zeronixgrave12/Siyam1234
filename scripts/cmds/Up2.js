const os = require("os");

module.exports = {
  config: {
    name: "up2",
    version: "3.2",
    author: "ᴀᴍɪᴛ⚡ᴍᴀx | Modified by Xrotick | Enhanced by ChatGPT",
    role: 0,
    shortDescription: { en: "Get stylish bot stats and uptime!" },
    longDescription: {
      en: "Displays bot uptime, user/thread/message stats, system info with stepped loading bar and local time (Dhaka)."
    },
    category: "system",
    guide: {
      en: "Use {p}up2 to view bot stats with stylish animation."
    }
  },

  onStart: async function ({ api, event, usersData, threadsData, messageCount }) {
    try {
      const steps = [
        { percent: 25, fill: 3 },
        { percent: 50, fill: 5 },
        { percent: 70, fill: 7 },
        { percent: 80, fill: 8 },
        { percent: 95, fill: 9 },
        { percent: 100, fill: 10 }
      ];

      const loadingStyle = (fill) => {
        const filled = "█ ".repeat(fill).trim();
        const empty = ". ".repeat(10 - fill).trim();
        return `[ ${filled}${empty ? ' ' + empty : ''} ]`.replace(/\s+/g, ' ').trim();
      };

      const msg = await api.sendMessage({
        body: "⏳ Loading [ . . . . . . . . . . ] 0%",
        replyToMessageID: event.messageID
      }, event.threadID);

      for (let i = 0; i < steps.length; i++) {
        const { percent, fill } = steps[i];
        await new Promise(res => setTimeout(res, 300));
        await api.editMessage(`⏳ Loading ${loadingStyle(fill)} ${percent}%`, msg.messageID, event.threadID);
      }

      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const activeThreads = allThreads.filter(t => t.messageCount > 0).length;
      const totalMessages = messageCount || 0;

      const memoryUsage = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
      const platform = os.platform();
      const arch = os.arch();
      const nodeVersion = process.version;
      const cpus = os.cpus();
      const cpuModel = cpus[0].model;
      const cpuCores = cpus.length;

      const uptime = process.uptime();
      const days = Math.floor(uptime / (60 * 60 * 24));
      const hours = Math.floor((uptime % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const startTime = new Date(Date.now() - uptime * 1000).toLocaleString("bn-BD", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      const finalStats = `
╭────────────────╮
   🪐 UPTIME STATS 🪐
╰────────────────╯

🕰️ Uptime: ${uptimeFormatted}
🗓️ Start Time: ${startTime}

👥 Users: ${allUsers.length}
💬 Threads: ${allThreads.length}
⚡ Active Threads: ${activeThreads}
🧾 Messages: ${totalMessages}

🖥️ Platform: ${platform} (${arch})
💾 Memory: ${memoryUsage} MB
⚙️ CPU: ${cpuModel} (${cpuCores} cores)
🛠️ Node: ${nodeVersion}
      `;

      await api.editMessage(finalStats.trim(), msg.messageID, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage(`⚠️ ত্রুটি ঘটেছে: ${err.message}`, event.threadID);
    }
  }
};
