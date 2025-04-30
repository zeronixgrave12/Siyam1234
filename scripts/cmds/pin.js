const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
    );
    return base.data.api;
};

module.exports = {
    config: {
        name: "pin",
        aliases: ["pinterest"],
        version: "1.1",
        author: "Dipto",
        countDown: 15,
        role: 0,
        shortDescription: "Pinterest Image Search",
        longDescription: "Pinterest Image Search",
        category: "download",
        guide: {
            en: "{pn} query or {pn} query -5",
        },
    },

    onStart: async function ({ api, event, args }) {
        if (!args[0]) {
            return api.sendMessage("❌| Please provide a search query.", event.threadID, event.messageID);
        }

        // Join all args and check if a hyphen/number exists
        const input = args.join(" ");
        const match = input.match(/^(.*?)\s*(?:-(\d+))?$/);
        const q = match[1].trim();
        const length = match[2] ? parseInt(match[2]) : 1; // Default to 1 image if no -N provided

        try {
            const w = await api.sendMessage("Please wait...", event.threadID);

            const response = await axios.get(
                `${await baseApiUrl()}/pinterest?search=${encodeURIComponent(q)}&limit=${encodeURIComponent(length)}`
            );
            const data = response.data.data;

            if (!data || data.length === 0) {
                return api.sendMessage("Empty response or no images found.", event.threadID, event.messageID);
            }

            const diptoo = [];
            const totalImagesCount = Math.min(data.length, length);

            for (let i = 0; i < totalImagesCount; i++) {
                const imgUrl = data[i];
                const imgResponse = await axios.get(imgUrl, {
                    responseType: "arraybuffer",
                });
                const imgPath = path.join(__dirname, "dvassests", `${i + 1}.jpg`);
                await fs.outputFile(imgPath, imgResponse.data);
                diptoo.push(fs.createReadStream(imgPath));
            }

            await api.unsendMessage(w.messageID);
            await api.sendMessage(
                {
                    body: `✅ | Here's Your Query Based Images\nTotal: ${totalImagesCount}`,
                    attachment: diptoo,
                },
                event.threadID,
                event.messageID
            );
        } catch (error) {
            console.error(error);
            await api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
        }
    },
};
