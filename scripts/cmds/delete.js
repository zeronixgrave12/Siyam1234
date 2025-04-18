const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    version: "1.0",
    author: "Amit Max ⚡",
    countDown: 0,
    role: 2,
    shortDescription: "Delete file/folder with confirmation",
    longDescription: "Owner-only command to delete any file after confirmation",
    category: "owner",
    guide: "{pn} <filename.js>"
  },

  onStart: async function ({ args, message, event }) {
    const permission = ["100088513497761"];
    if (!permission.includes(event.senderID)) {
      return message.reply("⛔ শুনছস ভাই! এইটা গ্যাংস্টার এর কমান্ড ☠️ — তুই হইছস লাস্ট বেঞ্চের পিচ্চি 🍼। হাইভোল্টেজ দিছস মনে করলি? ঘরে যা! 🏠");
    }

    const fileName = args[0];
    if (!fileName) return message.reply("📛 ফাইলের নামটা দে ভাই! নাম ছাড়া কেউ জানাজা পড়ে? ⚰️");

    const filePath = path.join(__dirname, "..", "cmds", fileName);
    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ "${fileName}" নামে কোনো ফাইল খুঁজে পাই নাই! 🤷 নাকি তুই ইমাজিনেশনের ফাইল দিছস? 🧠`);
    }

    const msg = await message.reply(`⚠️ "${fileName}" ফাইলটা একদম গায়েব কইরা দিবো 🧨। ❤️ দিবি তো? দিলেই RIP বলে বিদায় জানামু! 🪦`);
    global._deleteFileReacts ??= {};
    global._deleteFileReacts[msg.messageID] = {
      filePath,
      author: event.senderID,
      message
    };
  },

  onReaction: async function ({ event }) {
    const data = global._deleteFileReacts?.[event.messageID];
    if (!data || event.userID !== data.author || event.reaction !== "❤️") return;

    try {
      await fs.remove(data.filePath);
      await data.message.reply(`✅ খেলা শেষ! 🎮 "${path.basename(data.filePath)}" নামের ফাইলটা হইল হাওয়া 🌬️! বাঁচতে চাইলেও পারতো না ভাই... ☠️`);
    } catch (err) {
      await data.message.reply(`❌ ডিলিট দিতে গিয়া নিজেই ঝামেলায় পড়লাম রে ভাই! 🤯 মনে হয় ফাইলটা ভাইরাস ছিল! 🦠`);
    }

    delete global._deleteFileReacts[event.messageID];
  }
};
