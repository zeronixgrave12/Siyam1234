const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly"
    },
    longDescription: {
      en: "View command usage and list all commands directly"
    },
    category: "system",
    guide: {
      en: "{pn} / help cmdName"
    },
    priority: 1
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
      let msg = `✧ ʙᴏᴛ ᴄᴏᴍᴍᴀɴᴅꜱ ʟɪꜱᴛ ✧\n\n`;

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          const names = categories[category].commands.sort().join(" • ");
          msg += `✨ ${category.toUpperCase()}: ${names}\n\n`;
        }
      });

      msg += `📌 ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅꜱ: ${commands.size}\n`;
      msg += `🧾 ᴛʏᴘᴇ: ${prefix}help [cmdName] ꜰᴏʀ ᴅᴇᴛᴀɪʟꜱ\n`;
      msg += `👑 ᴏᴡɴᴇʀ: ᴀᴍɪᴛ ᴍᴀx ⚡`;

      const helpListImages = [
        'https://i.postimg.cc/858zKdyz/221887.gif'
      ];
      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      api.sendMessage(
        {
          body: msg,
          attachment: await global.utils.getStreamFromURL(helpListImage)
        },
        threadID,
        (error, messageInfo) => {
          if (!error) {
            setTimeout(() => {
              api.unsendMessage(messageInfo.messageID);
            }, 70000);
          }
        },
        event.messageID
      );

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ ᴄᴏᴍᴍᴀɴᴅ "${commandName}" ɴᴏᴛ ꜰᴏᴜɴᴅ.`);
      } else {
        const configCommand = command.config;
        const longDescription = configCommand.longDescription?.en || "No description available.";
        const usage = (configCommand.guide?.en || "No guide available.")
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name);

        const response = `
╭━━━「 🔍 ᴄᴏᴍᴍᴀɴᴅ ɪɴꜰᴏ 」━━━╮
┃ 🧩 ɴᴀᴍᴇ        : ${configCommand.name}
┃ 🗂️ ᴄᴀᴛᴇɢᴏʀʏ    : ${configCommand.category?.toLowerCase() || "ᴜɴᴄᴀᴛᴇɢᴏʀɪᴢᴇᴅ"}
┃ 📜 ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ : ${longDescription.toLowerCase()}
┃ 🔁 ᴀʟɪᴀꜱᴇꜱ     : ${(configCommand.aliases?.join(", ") || "ɴᴏɴᴇ").toLowerCase()}
┃ ⚙️ ᴠᴇʀꜱɪᴏɴ     : ${(configCommand.version || "1.0").toLowerCase()}
┃ 🔐 ᴘᴇʀᴍɪꜱꜱɪᴏɴ  : ${roleTextToString(configCommand.role).toLowerCase()}
┃ ⏱️ ᴄᴏᴏʟᴅᴏᴡɴ    : ${(configCommand.countDown || 1) + "ꜱ"}
┃ 👑 ᴀᴜᴛʜᴏʀ      : ${(configCommand.author || "ᴜɴᴋɴᴏᴡɴ").toLowerCase()}
┃
┃ 📖 ᴜꜱᴀɢᴇ:
┃ ${usage.toLowerCase()}
╰━━━━━━━━━━━━━━━━━━━━╯
`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "0 (ᴀʟʟ ᴜꜱᴇʀꜱ)";
    case 1: return "1 (ɢʀᴏᴜᴘ ᴀᴅᴍɪɴꜱ)";
    case 2: return "2 (ʙᴏᴛ ᴀᴅᴍɪɴ ꜱ ᴏɴʟʏ)";
    default: return "ᴜɴᴋɴᴏᴡɴ";
  }
}
