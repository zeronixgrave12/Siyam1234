const fs = require('fs');
const path = require('path');

const trashPath = path.join(__dirname, '..', 'trash');
if (!fs.existsSync(trashPath)) fs.mkdirSync(trashPath);

const pendingDeletes = {};

module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    version: "2.0",
    author: "Amit max ⚡",
    countDown: 0,
    role: 2,
    shortDescription: "Delete file with confirmation and restore support",
    longDescription: "Move file to trash with confirmation. Supports restore.",
    category: "owner",
    guide: "{pn} <filename>"
  },

  onStart: async function ({ args, message, event }) {
    const permission = ["100088513497761"];
    if (!permission.includes(event.senderID)) {
      return message.reply("⛔ NO PERMISSION:\n\nতুমি এই কমান্ড চালাতে পারবে না।");
    }

    const fileName = args[0];
    if (!fileName) return message.reply("⚠️ ফাইলের নাম লিখো: `{pn} filename.js`");

    const filePath = path.join(__dirname, '..', 'cmds', fileName);
    const trashFilePath = path.join(trashPath, fileName);

    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ ফাইল পাওয়া যায়নি: ${fileName}`);
    }

    pendingDeletes[event.senderID] = { filePath, trashFilePath, fileName };
    return message.reply(`⚠️ আপনি কি নিশ্চিত যে আপনি *${fileName}* ডিলিট করতে চান?\n\n✅ হ্যাঁ লিখুন / ❌ না লিখুন (৬০ সেকেন্ডের মধ্যে)।`);
  },

  onChat: async function ({ message, event }) {
    const data = pendingDeletes[event.senderID];
    if (!data) return;

    const text = message.body.toLowerCase();

    if (text === 'হ্যাঁ' || text === 'yes') {
      try {
        fs.renameSync(data.filePath, data.trashFilePath);
        delete pendingDeletes[event.senderID];
        return message.reply(`✅ ফাইল *${data.fileName}* সফলভাবে trash ফোল্ডারে মুভ হয়েছে!`);
      } catch (err) {
        return message.reply(`❌ ডিলিট করতে সমস্যা হয়েছে: ${err.message}`);
      }
    }

    if (text === 'না' || text === 'no') {
      delete pendingDeletes[event.senderID];
      return message.reply("❎ ফাইল ডিলিট বাতিল করা হয়েছে।");
    }
  }
};
