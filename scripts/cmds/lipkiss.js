module.exports = {
  config: {
    name: "lipkiss",
    version: "1.0",
    author: "Amit Max ⚡",
    description: "Send a romantic lip kiss using your custom gif",
    usage: "[tag/reply]",
    category: "love",
    cooldown: 3
  },

  onStart: async function ({ event, message, usersData }) {
    const { threadID, messageID, senderID, mentions, type } = event;

    let targetID, targetName;

    const mentionIDs = Object.keys(mentions || {});
    if (mentionIDs.length > 0) {
      targetID = mentionIDs[0];
      targetName = mentions[targetID];
    } else if (type === "message_reply") {
      targetID = event.messageReply.senderID;
      targetName = (await usersData.getName(targetID)) || "Someone";
    } else {
      return message.reply("Whom do you want to give a lip kiss? 😘💋 Please tag 🏷️ or reply 🔁 to someone!");
    }

    if (targetID === senderID) {
      return message.reply("Trying to lip kiss yourself? 🤨 Feeling lonely 🥺, huh?");
    }

    const senderName = (await usersData.getName(senderID)) || "Someone";

    const customGifURL = "https://drive.google.com/uc?export=download&id=178a4i_ZxaqR7UexfzuBFyu31_DJexb4N";

    const msg = `${senderName} just gave ${targetName} a passionate lip kiss 💋🔥...\n\n"A single kiss 😚, but it felt like a thousand promises 💞."`;

    message.send({
      body: msg,
      attachment: await global.utils.getStreamFromURL(customGifURL)
    });
  }
};
