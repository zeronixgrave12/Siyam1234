module.exports = {
  config: {
    name: "fbuser",
    version: "1.0.1",
    author: "xrotick",
    longDescription: "Get user information.",
    shortDescription: "Get user information.",
    category: "utility",
    countdown: 5,
  },
  
  onStart: async function ({ api, event, args }) {
    let { threadID, senderID, messageID } = event;
    
    const getUserInfo = async (targetID) => {
      try {
        const userInfo = await api.getUserInfo(targetID);
        const username = userInfo[targetID]?.name || "Name not available";
        const uid = targetID;
        const gender = userInfo[targetID]?.gender || "Gender not available";
        const birthday = userInfo[targetID]?.birthday || "Birthday not available";
        const fbLink = `https://www.facebook.com/profile.php?id=${uid}`;
        const profilePicUrl = userInfo[targetID]?.profileUrl || "";
        const userStatus = userInfo[targetID]?.isOnline ? "Online 🟢" : "Offline 🔴";
        const areFriends = userInfo[targetID]?.isFriend ? "Yes ✅" : "No ❌";
        const socialMediaLinks = userInfo[targetID]?.socialMediaLinks || "Not available";

        const userInfoMessage = `
🌟 User Information 🌟
📝 Name: ${username}
🆔 UID: ${uid}
👤 Gender: ${gender}
🎂 Birthday: ${birthday}
📊 Status: ${userStatus}
🤝 Friends: ${areFriends}
🌐 Facebook: ${fbLink}
🖼 Profile Pic: ${profilePicUrl}
🔗 Social Media: ${socialMediaLinks}
`;
        
        api.sendMessage(userInfoMessage, threadID, (error, info) => {
          if (!error) {
            setTimeout(() => {
              api.setMessageReaction("❤", info.messageID);
              api.setMessageReaction("😊", info.messageID);
              api.setMessageReaction("👍", info.messageID);
            }, 1000);
          }
        });
      } catch (error) {
        console.error(error);
        api.sendMessage("Error fetching user info.", threadID, messageID);
      }
    };
    
    if (!args[0]) {
      getUserInfo(senderID);
    } else if (args[0].includes("@")) {
      const mentionedUID = Object.keys(event.mentions)[0];
      if (mentionedUID) getUserInfo(mentionedUID);
    } else {
      api.sendMessage("Usage: fbuser or fbuser @mention", threadID, messageID);
    }
  },
};
