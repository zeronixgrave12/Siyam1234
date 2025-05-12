const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "info2",
    aliases: ["profile2", "owner2"], 
    author: "Amit Max ⚡",
    role: 0,
    shortDescription: "Show owner information",
    longDescription: "",
    category: "admin",
    guide: "{pn}",
    usePrefix: false 
  },

  onStart: async function ({ api, event }) {
    try {
      const toSmallCaps = (text) => {
        const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const smallCaps = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789";
        return text.split('').map(c => {
          const i = normal.indexOf(c);
          return i !== -1 ? smallCaps[i] : c;
        }).join('');
      };

      const ownerInfo = {
        name: 'Amit Max ⚡',
        class: 'Inter 1st',
        group: 'Accounting',
        gender: 'Male',
        dob: '18-05-2006',
        religion: 'Sanatan',
        blood: 'AB+',
        height: '5.5 ft',
        location: 'Khoksa, Kushtia',
        hobby: 'Flirting',
        status: 'Single',
        fb: 'fb.com/share/1564YX2VyT/',
        ig: 'instagram.com/amitmax44',
        email: 'maxamit279@gmail.com'
      };

      const time = moment().tz("Asia/Dhaka").format("M/D/YYYY, h:mm:ss A");

      const videoUrl = 'https://drive.google.com/uc?export=download&id=1lPj7JOtWRDLSSrUMN6F_Zw9cebvkQM84'; // Google Drive video download URL
      const tmpPath = path.join(__dirname, 'tmp');

      if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);

      const videoRes = await axios.get(videoUrl, { responseType: 'arraybuffer' });
      const videoPath = path.join(tmpPath, 'owner_video.mp4');
      fs.writeFileSync(videoPath, Buffer.from(videoRes.data, 'binary'));

      const response = `
𓆩 ${toSmallCaps("owner info")} 𓆪

• ${toSmallCaps("name")}: ${toSmallCaps(ownerInfo.name)}
• ${toSmallCaps("class")}: ${toSmallCaps(ownerInfo.class)}
• ${toSmallCaps("group")}: ${toSmallCaps(ownerInfo.group)}
• ${toSmallCaps("gender")}: ${toSmallCaps(ownerInfo.gender)}
• ${toSmallCaps("dob")}: ${toSmallCaps(ownerInfo.dob)}
• ${toSmallCaps("religion")}: ${toSmallCaps(ownerInfo.religion)}
• ${toSmallCaps("blood")}: ${toSmallCaps(ownerInfo.blood)}
• ${toSmallCaps("height")}: ${toSmallCaps(ownerInfo.height)}
• ${toSmallCaps("location")}: ${toSmallCaps(ownerInfo.location)}
• ${toSmallCaps("hobby")}: ${toSmallCaps(ownerInfo.hobby)}
• ${toSmallCaps("status")}: ${toSmallCaps(ownerInfo.status)}
• ${toSmallCaps("fb")}: ${toSmallCaps(ownerInfo.fb)}
• ${toSmallCaps("ig")}: ${toSmallCaps(ownerInfo.ig)}
• ${toSmallCaps("email")}: ${toSmallCaps(ownerInfo.email)}

⏰ ${toSmallCaps("time")}: ${toSmallCaps(time)}
      `;

      await api.sendMessage({
        body: response,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

      api.setMessageReaction('😍', event.messageID, () => {}, true);

    } catch (e) {
      console.error("OWNER INFO ERROR:", e);
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
  }
};
