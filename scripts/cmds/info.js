const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info"],
    author: "Amit Max ⚡",
    role: 0,
    shortDescription: "Show owner's personal profile",
    longDescription: "Displays a clean and stylized profile of the owner including name, birthday, hobbies, and social links.",
    category: "profile",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const profile = `
『 ᴀᴍɪᴛ ᴍᴀx ⚡ ᴘʀᴏꜰɪʟᴇ 』

╭﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣⭓
│ ➤ 𝗡𝗔𝗠𝗘           : 𝗔𝗠𝗜𝗧 𝗠𝗔𝗫 ⚡
│ ➤ 𝗖𝗟𝗔𝗦𝗦          : 𝗜𝗡𝗧𝗘𝗥 𝟭𝗦𝗧
│ ➤ 𝗚𝗥𝗢𝗨𝗣          : 𝗔𝗖𝗖𝗢𝗨𝗡𝗧𝗜𝗡𝗚
│ ➤ 𝗚𝗘𝗡𝗗𝗘𝗥         : 𝗠𝗔𝗟𝗘
│ ➤ 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬      : 𝟭𝟴-𝟬𝟱-𝟮𝟬𝟬𝟲
│ ➤ 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡      : 𝗦𝗔𝗡𝗔𝗧𝗔𝗡
│ ➤ 𝗕𝗟𝗢𝗢𝗗 𝗚𝗥𝗢𝗨𝗣   : 𝗔𝗕+
│ ➤ 𝗛𝗘𝗜𝗚𝗛𝗧        : 𝟱.𝟱 𝗙𝗘𝗘𝗧
│ ➤ 𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡      : 𝗞𝗛𝗢𝗞𝗦𝗔, 𝗞𝗨𝗦𝗛𝗧𝗜𝗔
│ ➤ 𝗛𝗢𝗕𝗕𝗬         : 𝗙𝗟𝗜𝗥𝗧𝗜𝗡𝗚
│ ➤ 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣  : 𝗦𝗜𝗡𝗚𝗟𝗘
│ ➤ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞      : fb.com/share/1564YX2VyT/
│ ➤ 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠     : instagram.com/amitmax44
│ ➤ 𝗘𝗠𝗔𝗜𝗟         : maxamit279@gmail.com
╰﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣﹣⭓

⏰ 𝗧𝗜𝗠𝗘: ${time}`;

    return api.sendMessage(profile, event.threadID);
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
