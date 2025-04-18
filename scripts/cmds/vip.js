const header = `👑 Amit Max Vip Users 👑`;

const fs = require("fs");

const vipFilePath = "vip.json";
const changelogFilePath = "changelog.json";

function loadVIPData() {
  try {
    const data = fs.readFileSync(vipFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error("VIP ডাটা লোড করতে গিয়া বাপান্ত হইছে:", err);
    return {};
  }
}

function saveVIPData(data) {
  try {
    fs.writeFileSync(vipFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("VIP ডাটা সেভ করতে গিয়া হাত পুইড়া গেছে:", err);
  }
}

function loadChangelog() {
  try {
    const data = fs.readFileSync(changelogFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error("চেঞ্জলগ লোড করতে গিয়া সিস্টেম হ্যাং:", err);
    return {};
  }
}

module.exports = {
  config: {
    name: "vip",
    version: "1.0",
    author: "Aryan Chauhan",
    role: 2,
    category: "Config",
    guide: {
      en: "!vip add <uid> - VIP-তে ঢুকাই\n!vip rm <uid> - VIP-থেকে ফালাই\n!vip list - VIP গ্যাং দেখাই\n!vip changelog - আপডেটের গল্প শুনাই",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const subcommand = args[0];

    if (!subcommand) return;

    let vipData = loadVIPData();

    if (subcommand === "add") {
      const uidToAdd = args[1];
      if (uidToAdd) {
        const userData = await usersData.get(uidToAdd);
        if (userData) {
          const userName = userData.name || "নেইমলেস পাবলিক";
          message.reply(`${header}
ওই ${userName} (${uidToAdd}) এখন VIP! মাথা উঁচু করে চল ভাই!`);
          api.sendMessage(`${header}
ওই ${userName} (${uidToAdd}), এখন তুই VIP! স্পেশাল পাওয়ারস্‌ অন!`, uidToAdd);
          Object.keys(vipData).forEach(async (uid) => {
            if (uid !== uidToAdd) {
              const vipUserData = await usersData.get(uid);
              if (vipUserData) {
                const vipUserName = vipUserData.name || "অচেনা VIP";
                api.sendMessage(`${header}
ওই VIP গ্যাং! দলে ঢুকছে ${userName} (${uidToAdd}) — একটু মাত দে, একটু খ্যাপ!`, uid);
              }
            }
          });
          vipData[uidToAdd] = true;
          saveVIPData(vipData);
        } else {
          message.reply(`${header}
UID ${uidToAdd} খুঁজে পাইলাম না ভাই — ভূতের নাম দিছোস নাকি?`);
        }
      } else {
        message.reply(`${header}
UID দে আগে! বাতাসে VIP বানানো আমার কাজ না ভাই!`);
      }
    } else if (subcommand === "rm") {
      const uidToRemove = args[1];
      if (uidToRemove && vipData[uidToRemove]) {
        delete vipData[uidToRemove];
        saveVIPData(vipData);
        const userData = await usersData.get(uidToRemove);
        if (userData) {
          const userName = userData.name || "অচেনা পাবলিক";
          message.reply(`${header}
${userName} (${uidToRemove}) VIP লিস্ট থাইকা খাঁইছে!`);
          api.sendMessage(`${header}
${userName} (${uidToRemove}), VIP লাইফ শেষ! এবার সাধারন মানুষের লাইনে দাঁড়া!`, uidToRemove);
          Object.keys(vipData).forEach(async (uid) => {
            if (uid !== uidToRemove) {
              const vipUserData = await usersData.get(uid);
              if (vipUserData) {
                const vipUserName = vipUserData.name || "ভাইপো VIP";
                api.sendMessage(`${header}
${userName} (${uidToRemove}) VIP ছিলো, এখন নাই! মন খারাপ না, লাইফ যায়!`, uid);
              }
            }
          });
        } else {
          message.reply(`${header}
UID ${uidToRemove} তো দেখি উধাও! কাকে ফালামু?`);
        }
      } else {
        message.reply(`${header}
UID ঠিকঠাক দে, ফালাইতে হইলে ঠিক মত চিনে নিতে হয়!`);
      }
    } else if (subcommand === "list") {
      const vipList = await Promise.all(Object.keys(vipData).map(async (uid) => {
        const userData = await usersData.get(uid);
        if (userData) {
          const userName = userData.name || "নেইমলেস VIP";
          return `• ${userName} (${uid})`;
        } else {
          return `• অজানা VIP (${uid})`;
        }
      }));

      if (vipList.length > 0) {
        message.reply(`${header}

» VIP গ্যাং যারা যারা:

${vipList.join(`\n`)}

নতুন VIP ঢুকাইতে বা ফালাইতে কমান্ড চালা: !vip add/rm <uid>`);
      } else {
        message.reply(`${header}
VIP লিস্ট খালি — কেরো নাই, কিচ্ছু নাই! একদম হাওয়া!`);
      }
    } else if (subcommand === "changelog") {
      const changelogData = loadChangelog();

      if (changelogData) {
        const changelogEntries = Object.keys(changelogData).filter((version) => parseFloat(version) >= 1.0);

        if (changelogEntries.length > 0) {
          const changelogText = changelogEntries.map((version) => `ভার্সন ${version}: ${changelogData[version]}`).join('\n');
          message.reply(`${header}
চলতেছে ভার্সন: ${module.exports.config.version}
চেঞ্জ কাহিনী:
${changelogText}`);
        } else {
          message.reply(`${header}
চলতেছে ভার্সন: ${module.exports.config.version}
চেঞ্জলগ খালি — ডেভলপার টা সম্ভবত ঘুমাইতেছে!`);
        }
      } else {
        message.reply("চেঞ্জলগ ডেটা পাইলাম না ভাই, ফাইলটা বোধহয় মার খাইছে!");
      }
    }
  }
};
