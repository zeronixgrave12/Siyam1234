.cmd install sysinfo.js const os = require('os');
const axios = require('axios');

module.exports = {
  config: {
    name: "sysinfo",
    version: "1.7",
    author: "Amit Max ⚡",
    shortDescription: {
      en: "Show system & bot statistics"
    },
    longDescription: {
      en: "Displays bot uptime, host info, CPU, memory, total groups and users"
    },
    category: "Utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1) Bot uptime
      const botUptime = formatTime(process.uptime());

      // 2) Host & OS Info
      const hostname = os.hostname();
      const platform = os.platform();
      const cpu = os.cpus()[0].model;
      const cores = os.cpus().length;
      const loadAvg = os.loadavg().map(v => v.toFixed(2)).join(", ");
      const totalMem = (os.totalmem() / 1024 ** 3).toFixed(2);
      const freeMem = (os.freemem() / 1024 ** 3).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const memUsage = ((usedMem / totalMem) * 100).toFixed(1);

      // 3) Fetch all threads and filter groups
      const threads = await api.getThreadList(200, null, ['INBOX']);
      const groupThreads = threads.filter(t => t.isGroup || t.threadType === 'GROUP');
      const totalGroups = groupThreads.length;

      // 4) For each group, fetch participant list and build unique user set
      const infos = await Promise.all(
        groupThreads.map(g => api.getThreadInfo(g.threadID))
      );
      const userSet = new Set();
      infos.forEach(info => {
        info.participantIDs.forEach(id => userSet.add(id));
      });
      const totalUsers = userSet.size;

      // 5) External IP
      let ip = "Could not fetch IP";
      try {
        const res = await axios.get('https://api.ipify.org?format=json');
        ip = res.data.ip;
      } catch {}

      // 6) Node.js version
      const nodeVersion = process.version;

      // 7) Send final message
      api.sendMessage(
        `-- 𝗦𝘆𝘀𝘁𝗲𝗺 & 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼

🕒 𝗕𝗼𝘁 𝗨𝗽𝘁𝗶𝗺𝗲: ${botUptime}

- 𝗛𝗼𝘀𝘁: ${hostname}
- 𝗢𝗦: ${platform}
- 𝗖𝗣𝗨: ${cpu} (${cores} Cores)
- 𝗟𝗼𝗮𝗱 𝗔𝘃𝗲𝗿𝗮𝗴𝗲: ${loadAvg}

💾 𝗠𝗲𝗺𝗼𝗿𝘆:
- Total: ${totalMem} GB
- Used: ${usedMem} GB (${memUsage}%)
- Free: ${freeMem} GB

🌐 𝗜𝗣: ${ip}
🔧 𝗡𝗼𝗱𝗲.𝗝𝗦 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${nodeVersion}

📊 𝗕𝗼𝘁 𝗦𝘁𝗮𝘁𝘀:
- 𝗧𝗼𝘁𝗮𝗹 𝗚𝗿𝗼𝘂𝗽𝘀: ${totalGroups}
- 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${totalUsers}`, 
        event.threadID
      );

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ System Info loading failed.", event.threadID);
    }
  }
};

// helper: seconds → "Xd Xh Xm Xs"
function formatTime(sec) {
  const d = Math.floor(sec / 86400);
  sec %= 86400;
  const h = Math.floor(sec / 3600);
  sec %= 3600;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}
