const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pin",
    aliases: ["pinterest"],
    version: "1.0.0",
    author: "Mahi--",
    role: 0,
    countDown: 10,
    shortDescription: {
      en: "Search images on Pinterest"
    },
    category: "image",
    guide: {
      en: "{prefix}pin <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const searchQuery = args.join(" ");

      // Check if the search query is provided
      if (!searchQuery) {
        return api.sendMessage(`Please provide a search query. Example: {prefix}pin cats -5`, event.threadID, event.messageID);
      }

      // Split the query and number of images
      const [query, numImages] = searchQuery.split("-").map(str => str.trim());
      const numberOfImages = numImages ? parseInt(numImages) : 1; // Default to 1 if no number is provided

      // Validate the number of images
      if (isNaN(numberOfImages)) {
        return api.sendMessage("Please specify a valid number for the number of images.", event.threadID, event.messageID);
      }
      if (numberOfImages <= 0 || numberOfImages > 25) {
        return api.sendMessage("Please specify a number between 1 and 25.", event.threadID, event.messageID);
      }

      // Fetch images from the API
      const apiUrl = `https://mahi-apis.onrender.com/api/pin?title=${encodeURIComponent(query)}&count=${numberOfImages}`;
      const response = await axios.get(apiUrl);
      const imageData = response.data.data;

      // Check if images are available
      if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
        return api.sendMessage(`No images found for "${query}".`, event.threadID, event.messageID);
      }

      // Download and prepare images
      const imgData = [];
      for (let i = 0; i < imageData.length; i++) {
        const imageUrl = imageData[i];
        try {
          const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(`Error downloading image: ${imageUrl}`, error);
        }
      }

      // Send the images
      await api.sendMessage({
        attachment: imgData,
        body: `Here are ${imageData.length} image(s) for "${query}":`
      }, event.threadID, event.messageID);

      // Clean up cache
      for (const imgPath of imgData) {
        fs.unlinkSync(imgPath.path);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred while processing your request.`, event.threadID, event.messageID);
    }
  }
};
