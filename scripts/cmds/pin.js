const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["Pinterest", "pin"],
    version: "1.0",
    author: "SiAM",
    countDown: 5,
    role: 0,
    shortDescription: "Search Pinterest and return images",
    longDescription: "Fetches images from Pinterest based on a search query",
    category: "Image",
    guide: {
      en: "{pn} your query - [count]\n\n" +
          "Example: {pn} cute cats - 8\n" +
          "• Default count is 1 image\n" +
          "• Maximum is 50 images\n" +
          "• You can reply to an image message to use that image as context (not implemented here)"
    }
  },

  onStart: async function({ api, args, message, event }) {
    try {
      // determine how many images to fetch
      let count = 1;  // Default count is 1 image
      const dashIndex = args.indexOf("-");
      if (dashIndex !== -1 && args.length > dashIndex + 1) {
        const n = parseInt(args[dashIndex + 1], 10);
        if (!isNaN(n)) {
          count = Math.min(n, 50);  // Maximum count is 50 images
        }
        args.splice(dashIndex, 2);
      }

      // build query string
      let query = args.join(" ").trim();
      if (!query) {
        return message.reply("Please provide a search query. Example: /Pinterest mountains - 8");
      }

      // Check if query is related to Anime (by checking for anime-related keywords)
      const animeKeywords = ["naruto", "one piece", "dragon ball", "luffy", "sakura", "anime", "manga", "character"];
      const isAnimeQuery = animeKeywords.some(keyword => query.toLowerCase().includes(keyword));

      // If query contains anime keywords, treat it as anime-related search
      if (isAnimeQuery) {
        query = `${query} anime`;  // Add 'anime' to the query to focus on anime images
      }

      // send "processing" feedback
      const processingMessage = await message.reply("🔍 Fetching images from Pinterest...");
      message.reaction("⏰", event.messageID);

      // call the Pinterest API
      const res = await axios.get(
        `https://connect-foxapi.onrender.com/pinterest?search=${encodeURIComponent(query)}`
      );

      const links = Array.isArray(res.data.links) ? res.data.links : [];
      const toSend = links.slice(0, count);

      if (toSend.length === 0) {
        await message.reply(`No images found for "${query}".`);
      } else {
        // fetch all image streams in parallel
        const streams = await Promise.all(
          toSend.map((url) => getStreamFromURL(url))
        );

        // send as a single message with multiple attachments
        await message.reply({
          body: `Here are ${streams.length} images for "${query}":`,
          attachment: streams
        });
      }

      // cleanup and reactions
      await message.unsend(processingMessage.messageID);
      await message.reaction("✅", event.messageID);

    } catch (error) {
      console.error(error);
      message.reply("Err.\nServer has issue 😾");
    }
  }
};
