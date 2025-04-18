const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    version: "1.1",
    author: "Amit Max ⚡",
    countDown: 0,
    role: 2,
    shortDescription: "Delete file by reacting",
    longDescription: "React with ✔️ to delete a file instantly",
    category: "owner",
    guide: {
      en: "{pn} <filename> (React to confirm delete)"
    }
  },

  onStart: async function ({ args, message, event, api }) {
    const permission = ["100088513497761"]; // Just your ID
    if (!permission.includes(event.senderID)) {
      return message.reply("⛔ তোর বাপ ছাড়া এই কমান্ড কেউ চালাতে পারবে না 😡");
    }

    const fileName = args[0] || "testfile"; // Default to testfile
    const filePath = path.join(__dirname, `${fileName}.js`);

    if (!fs.existsSync(filePath)) {
      return message.reply(`❌ এই নামে কোনো ফাইল পাই নাই: ${fileName}.js`);
    }

    const confirmMsg = await message.reply(`⚠️ ফাইলটি ডিলেট করতে ✔️ রিয়্যাক্ট করো:`);

    const handleReaction = async ({ reaction, userID }) => {
      if (userID !== event.senderID || reaction !== '✔️') return;
      try {
        fs.unlinkSync(filePath);
        api.removeListener('messageReaction', handleReaction);
        return message.reply(`✅️ অমিত ম্যাক্স ⚡ এর কমান্ডে ${fileName}.js ফাইলটা বালের মত উড়ে গেল`);
      } catch (err) {
        return message.reply(`❌ তোর ফাইলটা ডিলেট করতে সমস্যা হইছে রে: ${err.message}`);
      }
    };

    api.listenMqttEvent('messageReaction', handleReaction);
  }
};
