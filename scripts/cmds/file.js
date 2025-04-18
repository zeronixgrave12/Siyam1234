const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "file",
    aliases: ["files", "sendfile"],
    version: "1.3",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Send bot file",
    longDescription: "Send any command file as both text and .txt attachment",
    category: "OWNER",
    guide: "{pn} filename (without .js)"
  },

  onStart: async function ({ message, args, api, event }) {
    const permission = ["100088513497761"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("⛔ Access Denied: খানকির ছেলে আর একবার File চালি তোর গুষ্টি চুদে দিব 😡. Only‌ Amit max ⚡ can do it.", event.threadID, event.messageID);
    }

    const fileName = args[0];
    if (!fileName) {
      return api.sendMessage("⚠️ দয়া করে ফাইলের নাম লিখো। যেমন: `.file ping`", event.threadID, event.messageID);
    }

    const jsPath = path.join(__dirname, `${fileName}.js`);
    const txtPath = path.join(__dirname, `${fileName}.txt`);

    if (!fs.existsSync(jsPath)) {
      return api.sendMessage(`❌ ফাইল পাওয়া যায়নি: "${fileName}.js"`, event.threadID, event.messageID);
    }

    try {
      const content = fs.readFileSync(jsPath, 'utf8');

      // Write to .txt
      fs.writeFileSync(txtPath, content, 'utf8');

      await api.sendMessage({
        body: `📄 ফাইল: ${fileName}.js\n\n✅ সংযুক্তিতে .js ও .txt ফাইল পাঠানো হয়েছে।`,
        attachment: [
          fs.createReadStream(jsPath),
          fs.createReadStream(txtPath)
        ]
      }, event.threadID, event.messageID);

      // Optional: Clean up .txt file after sending (uncomment below if you want)
      // fs.unlinkSync(txtPath);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❗ফাইল পাঠাতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  }
};
