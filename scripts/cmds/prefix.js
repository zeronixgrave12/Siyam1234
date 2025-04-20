const fs = require("fs-extra");
const moment = require("moment-timezone");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.5",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    description: "Change or show bot prefix",
    category: "config",
    guide: {
      en: "prefix: show your system & group prefix\n{pn} <new prefix>: change prefix\n{pn} <new prefix> -g: global\n{pn} reset"
    }
  },

  langs: {
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal: "React to this message to confirm global prefix change.",
      confirmThisThread: "React to this message to confirm group prefix change.",
      successGlobal: "✅ Global prefix changed to: %1",
      successThisThread: "✅ Group prefix changed to: %1",
      myPrefix: `┏━━━━━━━━━━━━━━━┓
✨ PREFIX SETTINGS
┗━━━━━━━━━━━━━━━┛
👤 User: %1
👑 Owner: Amit Max ⚡
🔷 Global: %2
🔶 Group: %3
⏰ Time: %4
⌛ Auto Delete in 20 seconds...`
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, usersData, getLang }) {
    const { threadID, senderID } = event;

    if (!args[0]) return message.SyntaxError();

    if (args[0] === 'reset') {
      await threadsData.set(threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: senderID,
      newPrefix,
      setGlobal: args[1] === "-g"
    };

    if (formSet.setGlobal && role < 2)
      return message.reply(getLang("onlyAdmin"));

    return message.reply(
      formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread"),
      (err, info) => {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, usersData, getLang }) {
    const { threadID, senderID, body } = event;
    if (!body || body.toLowerCase() !== "prefix") return;

    const globalPrefix = global.GoatBot.config.prefix;
    const groupPrefix = utils.getPrefix(threadID);
    const time = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
    const userName = (await usersData.getName(senderID)) || "User";

    const msg = getLang("myPrefix", userName, globalPrefix, groupPrefix, time);

    return message.reply({ body: msg, mentions: [{ tag: userName, id: senderID }] }, (err, info) => {
      setTimeout(() => {
        message.unsend(info.messageID);
      }, 20_000);
    });
  }
};
