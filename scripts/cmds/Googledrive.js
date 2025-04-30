const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "g",
    aliases:["google--dv","g--dv"],
    version: "1.0",
    author: "xrotick 🥀",
    countDown: 5,
    role: 2,
    shortDescription: "Upload replied file to Google Drive",
    longDescription: "Upload any attachment you reply to into Google Drive and get a public download link.",
    category: "tools",
    guide: "{pn} (reply to a file to upload)"
  },

  onStart: async function({ api, event, message }) {
    const client_id = "96871167660-5js0qjdlpr2mcd331kv5obpifev5j69r.apps.googleusercontent.com";
    const client_secret = "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";
    const refresh_token = "1//04qK_zxJkdK7RCgYIARAAGAQSNwF-L9IrZOdI4prCgpqvAoDEvn-HpuSugKxBTRNoGS37QwxfAWJUCehSKhdas26xOh-SjmdR4uw";

    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return message.reply("Please reply to an attachment (photo, video, file) to upload.");
    }

    const attachment = event.messageReply.attachments[0];
    const url = attachment.url;
    const ext = path.extname(url) || ".jpg"; // default to jpg if unknown
    const tempFilePath = path.join(__dirname, "tempfile" + ext);

    const downloading = await message.reply("Downloading your file...");

    try {
      // Step 1: Download the attachment
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // Step 2: Get Access Token
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        client_id,
        client_secret,
        refresh_token,
        grant_type: 'refresh_token'
      });
      const access_token = tokenRes.data.access_token;

      // Step 3: Upload to Drive
      const fileName = `Uploaded_${Date.now()}${ext}`;
      const driveRes = await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        name: fileName
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const fileId = driveRes.data.id;

      // Step 4: Upload file content
      const media = fs.createReadStream(tempFilePath);
      await axios.patch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, media, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': attachment.type.includes("video") ? 'video/mp4' : 'application/octet-stream'
        }
      });

      // Step 5: Make the file public
      await axios.post(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        role: "reader",
        type: "anyone"
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const publicUrl = `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`;

      await message.reply(`${publicUrl}`);
    } catch (error) {
      console.error(error.response?.data || error.message);
      await message.reply("❌ Failed to upload the file. Please try again.");
    } finally {
      // Clean temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      api.unsendMessage(downloading.messageID);
    }
  }
};
