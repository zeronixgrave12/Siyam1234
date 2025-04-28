// 📦 Project: System Info Pro
// ✍️ Credit: Amit Max ⚡
// 📜 Rule No: Only bot owner (role 0) can run
// 🎯 Role No: 0

const os = require('os');
const axios = require('axios');

module.exports.config = {
  name: "sysinfo",
  version: "1.2.0",
  role: 0,
  credits: "Amit Max ⚡",
  description: "Display bot & system stats"
};

module.exports.onStart = async function({ api, event }) {
  const { threadID, messageID } = event;

  // helper: seconds ➔ "Xd Xh Xm Xs"
  function formatTime(sec) {
    const d = Math.floor(sec / 86400); sec %= 86400;
    const h = Math.floor(sec / 3600); sec %= 3600;
    const m = Math.floor(sec / 60); sec %= 60;
    const s = Math.floor(sec);
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  try {
    // 1) show loading
    const loading = await api.sendMessage("🔄 Loading System Info...", threadID);

    // 2) gather uptimes
    const systemUptime = formatTime(os.uptime());
    const botUptime = formatTime(process.uptime());

    // 3) CPU & load
    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const loadAvg = os.loadavg().map(v => v.toFixed(2)).join(", ");

    // 4) fetch group threads
    let threads = [];
    try {
      threads = await api.getThreadList(200, null, ["INBOX"]);
    } catch (e) {
      console.warn("Could not fetch thread list:", e);
    }
    const groupThreads = threads.filter(t => t.isGroup);
    const totalGroups = groupThreads.length;

    // 5) count unique users across groups
    const users = new Set();
    for (const g of groupThreads) {
      try {
        const info = await api.getThreadInfo(g.threadID);
        info.participantIDs.forEach(id => users.add(id));
      } catch {}
    }
    const totalUsers = users.size;

    // 6) current group info
    let currentName = "Unknown", currentCount = 0;
    try {
      const cur = await api.getThreadInfo(threadID);
      currentName = cur.name;
      currentCount = cur.participantIDs.length;
    } catch {}

    // 7) IP & Node
    let ip = "Unavailable";
    try {
      const res = await axios.get("https://api.ipify.org?format=json");
      ip = res.data.ip;
    } catch {}
    const nodeV = process.version;
    const platform = os.platform();

    // 8) build final message
    const msg = `✨ 𝗕𝗼𝘁 & 𝗦𝗶𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘀

⏳ System Uptime: ${systemUptime}
🤖 Bot Uptime: ${botUptime}

📊 Bot Stats:
- Total Groups: ${totalGroups}
- Total Users: ${totalUsers}

💬 Current Group:
- Name: ${currentName}
- Members: ${currentCount}

🛠 System Details:
- Platform: ${platform}
- CPU: ${cpu} (${cores} Cores)
- Load Avg: ${loadAvg}
- Node.js: ${nodeV}
- IP: ${ip}`;

    // 9) edit loading
    await api.editMessage(msg, loading.messageID, threadID);
  }
  catch (err) {
    console.error("sysinfo failed:", err);
    return api.sendMessage("❌ Could not load system information.", threadID, messageID);
  }
};
