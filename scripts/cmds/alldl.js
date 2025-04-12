const axios = require("axios");
const fs = require("fs");
const path = require("path");

const alldApi = async () => {
  const response = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return response.data.alldl;
};

module.exports.config = {
  name: "alldl",
  aliases: ["dl", "download"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  description: "Download videos from YouTube, TikTok, Facebook, Instagram",
  category: "media",
  countDown: 3,
  guide: {
    en: "{pn} [url] or reply with a URL",
  },
};

module.exports.onStart = async ({ api, event, args, message }) => {

  const allApisMain = {
  TikTok: {
    regex: /(?:https?:\/\/)?(?:www\.)?tiktok\.com/,
    apiName: "tikDL",
  },
  Facebook: {
    regex: /(?:https?:\/\/)?(?:www\.)?(facebook\.com|fb\.watch|facebook\.com\/share\/v)/,
    apiName: "fbDL",
  },
  YouTube: {
    regex: /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)/,
    apiName: "alldl",
  },
  Twitter: {
    regex: /(?:https?:\/\/)?(?:www\.)?twitter\.com/,
    apiName: "alldl",
  },
  Instagram: {
    regex: /(?:https?:\/\/)?(?:www\.)?instagram\.com/,
    apiName: "instaDL",
  },
  Reddit: {
    regex: /(?:https?:\/\/)?(?:www\.)?reddit\.com/,
    apiName: "alldl",
  },
  Pinterest: {
    regex: /(?:https?:\/\/)?(?:www\.)?pinterest\.com/,
    apiName: "alldl",
  },
  Imgur: {
    regex: /(?:https?:\/\/)?(?:www\.)?imgur\.com/,
    apiName: "alldl",
  },
  Flickr: {
    regex: /(?:https?:\/\/)?(?:www\.)?flickr\.com/,
    apiName: "alldl",
  },
  DeviantArt: {
    regex: /(?:https?:\/\/)?(?:www\.)?deviantart\.com/,
    apiName: "alldl",
  },
  Unsplash: {
    regex: /(?:https?:\/\/)?(?:www\.)?unsplash\.com/,
    apiName: "alldl",
  },
  Pexels: {
    regex: /(?:https?:\/\/)?(?:www\.)?pexels\.com/,
    apiName: "alldl",
  },
  Pixabay: {
    regex: /(?:https?:\/\/)?(?:www\.)?pixabay\.com/,
    apiName: "alldl",
  },
  Gfycat: {
    regex: /(?:https?:\/\/)?(?:www\.)?gfycat\.com/,
    apiName: "alldl",
  },
  Streamable: {
    regex: /(?:https?:\/\/)?(?:www\.)?streamable\.com/,
    apiName: "alldl",
  },
  Dailymotion: {
    regex: /(?:https?:\/\/)?(?:www\.)?dailymotion\.com/,
    apiName: "alldl",
  },
  BiliBili: {
    regex: /(?:https?:\/\/)?(?:www\.)?bilibili\.com/,
    apiName: "alldl",
  },
  OKRu: {
    regex: /(?:https?:\/\/)?(?:www\.)?ok\.ru/,
    apiName: "alldl",
  },
  GAG: {
    regex: /(?:https?:\/\/)?(?:www\.)?9gag\.com/,
    apiName: "alldl",
  },
  Telegram: {
    regex: /(?:https?:\/\/)?(?:www\.)?t\.me/,
    apiName: "alldl",
  },
  Imgbb: {
    regex: /(?:https?:\/\/)?(?:www\.)?imgbb\.com/,
    apiName: "alldl",
  },
  GoFile: {
    regex: /(?:https?:\/\/)?(?:www\.)?gofile\.io/,
    apiName: "alldl",
  },
  AnonFiles: {
    regex: /(?:https?:\/\/)?(?:www\.)?anonfiles\.com/,
    apiName: "alldl",
  },
  Mega: {
    regex: /(?:https?:\/\/)?(?:www\.)?mega\.nz/,
    apiName: "alldl",
  },
  FileIo: {
    regex: /(?:https?:\/\/)?(?:www\.)?file\.io/,
    apiName: "alldl",
  },
  Pornhub: {
    regex: /(?:https?:\/\/)?(?:www\.)?pornhub\.com/,
    apiName: "alldl",
  },
  XVideos: {
    regex: /(?:https?:\/\/)?(?:www\.)?xvideos\.com/,
    apiName: "alldl",
  },
  XHamster: {
    regex: /(?:https?:\/\/)?(?:www\.)?xhamster\.com/,
    apiName: "alldl",
  },
  Erome: {
    regex: /(?:https?:\/\/)?(?:www\.)?erome\.com/,
    apiName: "alldl",
  },
  Fapello: {
    regex: /(?:https?:\/\/)?(?:www\.)?fapello\.com/,
    apiName: "alldl",
  },
  Fansly: {
    regex: /(?:https?:\/\/)?(?:www\.)?fansly\.com/,
    apiName: "alldl",
  },
  OnlyFans: {
    regex: /(?:https?:\/\/)?(?:www\.)?onlyfans\.com/,
    apiName: "alldl",
  },
  Txxx: {
    regex: /(?:https?:\/\/)?(?:www\.)?txxx\.com/,
    apiName: "alldl",
  },
  SpankBang: {
    regex: /(?:https?:\/\/)?(?:www\.)?spankbang\.com/,
    apiName: "alldl",
  },
  Rule34: {
    regex: /(?:https?:\/\/)?(?:www\.)?rule34\.xxx/,
    apiName: "alldl",
  },
  LeakGirls: {
    regex: /(?:https?:\/\/)?(?:www\.)?leakgirls\.com/,
    apiName: "alldl",
  },
  Streamja: {
    regex: /(?:https?:\/\/)?(?:www\.)?streamja\.com/,
    apiName: "alldl",
  },
  Clipwatching: {
    regex: /(?:https?:\/\/)?(?:www\.)?clipwatching\.com/,
    apiName: "alldl",
  },
  Puffin: {
    regex: /(?:https?:\/\/)?(?:www\.)?puffin\.io/,
    apiName: "alldl",
  },
  CloudflareStream: {
    regex: /(?:https?:\/\/)?(?:www\.)?stream\.cloudflare\.com/,
    apiName: "alldl",
  },
   MegaUpload: {
    regex: /(?:https?:\/\/)?(?:www\.)?megaupload\.com/,
    apiName: "alldl",
  },
  ZippyShare: {
    regex: /(?:https?:\/\/)?(?:www\.)?zippyshare\.com/,
    apiName: "alldl",
  },
  Mediafire: {
    regex: /(?:https?:\/\/)?(?:www\.)?mediafire\.com/,
    apiName: "alldl",
  },
  FileFactory: {
    regex: /(?:https?:\/\/)?(?:www\.)?filefactory\.com/,
    apiName: "alldl",
  },
  Rapidgator: {
    regex: /(?:https?:\/\/)?(?:www\.)?rapidgator\.net/,
    apiName: "alldl",
  },
  shared: {
    regex: /(?:https?:\/\/)?(?:www\.)?4shared\.com/,
    apiName: "alldl",
  },
  SendSpace: {
    regex: /(?:https?:\/\/)?(?:www\.)?sendspace\.com/,
    apiName: "alldl",
  },
  UsersCloud: {
    regex: /(?:https?:\/\/)?(?:www\.)?userscloud\.com/,
    apiName: "alldl",
  },
  Uploadhaven: {
    regex: /(?:https?:\/\/)?(?:www\.)?uploadhaven\.com/,
    apiName: "alldl",
  },
  Turbobit: {
    regex: /(?:https?:\/\/)?(?:www\.)?turbobit\.net/,
    apiName: "alldl",
  },
  FileBeam: {
    regex: /(?:https?:\/\/)?(?:www\.)?filebeam\.com/,
    apiName: "alldl",
  },
  StreamSB: {
    regex: /(?:https?:\/\/)?(?:www\.)?streamsbs\.com/,
    apiName: "alldl",
  },
  BayFiles: {
    regex: /(?:https?:\/\/)?(?:www\.)?bayfiles\.com/,
    apiName: "alldl",
  },
  UploadFiles: {
    regex: /(?:https?:\/\/)?(?:www\.)?uploadfiles\.io/,
    apiName: "alldl",
  },
  SolidFiles: {
    regex: /(?:https?:\/\/)?(?:www\.)?solidfiles\.com/,
    apiName: "alldl",
  },
  FileSend: {
    regex: /(?:https?:\/\/)?(?:www\.)?filesend\.net/,
    apiName: "alldl",
  },
  StreamCloud: {
    regex: /(?:https?:\/\/)?(?:www\.)?streamcloud\.eu/,
    apiName: "alldl",
  },
  CloudMail: {
    regex: /(?:https?:\/\/)?(?:www\.)?cloudmail\.ru/,
    apiName: "alldl",
  },
  Cloudinary: {
    regex: /(?:https?:\/\/)?(?:www\.)?cloudinary\.com/,
    apiName: "alldl",
  },
};

  const apiNameEndpoint = (url) => {
    for (const [platform, data] of Object.entries(allApisMain)) {
      if (data.regex.test(url)) {
        return data.apiName;
      }
    }
    return null;
  };

  const url = event.messageReply?.body || args[0];

  if (!url) {
    return message.reply("❌ Please provide a URL or reply to a message containing a link.");
  }

  try {
    const alldlBase = await alldApi();
    const apiName = apiNameEndpoint(url);

    if (!apiName) {
      return message.reply("❌ Unsupported URL. Please provide a valid link.");
    }

    const { data } = await axios.get(
      `${alldlBase}/nazrul/${apiName}?url=${encodeURIComponent(url)}`
    );

    const videoUrl = data?.videos?.[0]?.url || data?.url;

    if (!videoUrl) {
      throw new Error("Download link not found.");
    }

    const downloadPath = path.resolve(__dirname, "downloaded_video.mp4");

    const writer = fs.createWriteStream(downloadPath);
    const videoStream = (await axios.get(videoUrl, { responseType: "stream" })).data;

    videoStream.pipe(writer);

    writer.on("finish", async () => {
      await api.sendMessage(
        {
          body: "Here's your downloaded video 🦆💨",
          attachment: fs.createReadStream(downloadPath),
        },
        event.threadID,
        () => {
          fs.unlinkSync(downloadPath);
        },
        event.messageID
      );
    });

    writer.on("error", (error) => {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    });
  } catch (error) {
    await api.sendMessage(`❌ Error: ${error.message}`, event.threadID, event.messageID);
  }
};
