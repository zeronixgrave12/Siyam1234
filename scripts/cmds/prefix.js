module.exports = {
  config: {
    name: "prefix",
    aliases: [],
    author: "Amit Max ⚡",
    role: 0,
    shortDescription: "Show bot prefix",
    longDescription: "Displays the current prefix and group prefix of the bot",
    category: "utility",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const { threadID, senderID } = event;

    let userName = "User";
    try {
      const info = await api.getUserInfo(senderID);
      userName = info[senderID]?.name || "User";
    } catch (e) {}

    const threadData = global.data?.threadData?.get(threadID);
    const prefix = threadData?.prefix || global.config?.prefix || '.';

    const time = new Date().toLocaleTimeString('en-US', {
      hour12: true,
      timeZone: 'Asia/Dhaka'
    });

    const msg = `
┏━━━━━━━━━━━━━━━━━━┓
┃   ✨ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦
┣━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝗨𝘀𝗲𝗿: @${userName}
┃ 👑 𝗢𝘄𝗻𝗲𝗿: Amit Max ⚡
┃ 🔹 𝗚𝗹𝗼𝗯𝗮𝗹: ${global.config?.prefix || '.'}
┃ 🔸 𝗚𝗿𝗼𝘂𝗽: ${prefix}
┃ ⏰ 𝗧𝗶𝗺𝗲: ${time}
┗━━━━━━━━━━━━━━━━━━┛

⏳ 𝗔𝘂𝘁𝗼 𝗗𝗲𝗹𝗲𝘁𝗲 𝗶𝗻 𝟮𝟬 𝘀𝗲𝗰𝗼𝗻𝗱𝘀...
`;

    api.sendMessage({
      body: msg,
      mentions: [{
        id: senderID,
        tag: `@${userName}`
      }]
    }, threadID, (err, res) => {
      if (!err) {
        setTimeout(() => {
          api.unsendMessage(res.messageID);
        }, 20000);
      }
    });
  }

  // onChat অংশ বাদ দেওয়া হয়েছে যাতে ডাবল রেসপন্স না আসে
};
