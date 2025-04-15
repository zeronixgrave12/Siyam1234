const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
    config: {
        name: "niji",
        aliases: ['nijiv4'],
        version: "1.0",
        author: "SiAM",
        countDown: 5,
        role: 0,
        shortDescription: "Generate high-quality Anime images using Niji V4.",
        longDescription: "niji V4",
        category: "Image",
        guide: {
            en: "{pn} prompt --ar [aspect_ratio]\n\nExample: {pn} pretty girl --ar 16:9\n[default aspect ratio is 1:1]"
        }
    },


    onStart: async function({ api, args, message, event }) {
        try {
            const prompt = args.join(" ");
            let aspectRatio = "1:1"; 

            const aspectIndex = args.indexOf("--ar");
            if (aspectIndex !== -1 && args.length > aspectIndex + 1) {
                aspectRatio = args[aspectIndex + 1];
                args.splice(aspectIndex, 2); 
            }

            if (!prompt) {
                message.reply("Please provide a prompt to generate the image.");
                return;
            }

            const apiUrl = `https://simoai-niji.onrender.com/v4/niji/generate?prompt=${encodeURIComponent(prompt)}&aspectRatio=${aspectRatio}`;

            const processingMessage = await message.reply("Your imagination is Processing...⏳");
            message.reaction("⏰", event.messageID);

            const response = await axios.get(apiUrl);
            const genimg = response.data.imageUrl;

            message.reply({
                body: "Your imagination has been generated ✨",
                attachment: await getStreamFromURL(genimg)
            });
            message.unsend((await processingMessage).messageID);
            await message.reaction("✅", event.messageID);
        } catch (error) {
            console.error(error);
            message.reply("Error.\nServer has iskil issue 😾");
        }
    }
};
