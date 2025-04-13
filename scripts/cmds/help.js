const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author Kshitiz 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "system",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ api, message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);
    const categories = {};

    for (const [name, value] of commands) {
      if (value.config.role > 1 && role < value.config.role) continue;
      const category = value.config.category || "Uncategorized";
      categories[category] = categories[category] || { commands: [] };
      categories[category].commands.push(name);
    }

    if (args.length === 0) {
      let msg = `♡ All Commands Of This Bot ♡\n`;
      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          const names = categories[category].commands.sort().join(" • ");
          msg += `✨ ${category.toUpperCase()}: ${names}\n\n`;
        }
      });

      msg += `🔖 Bot has: ${commands.size} Commands\n`;
      msg += `📜 Use: ${prefix}help cmdName for details\n\n`;
      msg += `👑 Owner: ᴀᴍɪᴛ ᴍᴀx ⚡\n`;

      const helpListImages = [
        'https://i.imgur.com/yuC6bCY.gif'
      ];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

 api.sendMessage with attachment
      api.sendMessage(
        {
          body: msg,
          attachment: await global.utils.getStreamFromURL(helpListImage) // Getting the attachment from URL
        },
        threadID,
        (error, messageInfo) => {
          if (!error) {
            setTimeout(() => {
              api.unsendMessage(messageInfo.messageID);
            }, 25000);
          }
        },
        event.messageID
      );

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const longDescription = configCommand.longDescription?.en || "No description available.";
        const usage = (configCommand.guide?.en || "No guide available.")
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name);

        const response = `
 🔖 ᴄᴏᴍᴍᴀɴᴅ ɪɴꜰᴏ 🔖
 
  📜ᴄᴏᴍᴍᴀɴᴅ: ${configCommand.name}
  🪐ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ: ${longDescription}
  🏷️ᴀʟɪᴀꜱᴇꜱ: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}
  🛸ᴠᴇʀꜱɪᴏɴ: ${configCommand.version || "1.0"}
  🚨ᴘᴇʀᴍɪꜱꜱɪᴏɴ: ${roleTextToString(configCommand.role)}
  🕰️ᴛɪᴍᴇ ᴘᴇʀ ᴜꜱᴀɢᴇ: ${configCommand.countDown || 1}s

`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "0 (All Users)";
    case 1: return "1 (Group Admins)";
    case 2: return "2 (Bot Admin Only)";
    default: return "Unknown Permission";
  }
}
