const axios = require('axios');

module.exports = {
  config: {
    name: "hot",
    aliases: ["hotvideo"],
    version: "2.0",
    author: "Amit Max ⚡",
    countDown: 20,
    role: 0,
    shortDescription: "",
    longDescription: "bot will send you random video to entertain you",
    category: "Hot",
    guide: "{pn}",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "𝗹𝘂𝗰𝗰𝗵𝗮𝗺𝗶 𝗰𝗵𝗲𝗿𝗲 𝗱𝗲...😒 🫦",
    });

    const driveLinks = [
      "https://drive.google.com/file/d/13t3UibYYbEUWG7EoWT7LGbepmM6mmM9g/view?usp=drivesdk",
      "https://drive.google.com/file/d/12wXF3ir_QHPLTT3MbG0IGC8qrPloO8Sa/view?usp=drivesdk",
      "https://drive.google.com/file/d/14Y3xgv4QtRXI-Rp2FWOE02exn64VmZZ3/view?usp=drivesdk",
      "https://drive.google.com/file/d/14seg6wY3XOkugrGRS6Cb8ap42tA3uqVM/view?usp=drivesdk",
      "https://drive.google.com/file/d/13CLkzlJ4O1AJVF-zOCMYJSdRP89kJ8TD/view?usp=drivesdk",
      "https://drive.google.com/file/d/131eK1tUWwDJQVRukVkUlpNp947lScINU/view?usp=drivesdk",
      "https://drive.google.com/file/d/13D6rGpz3TMcN1TGHW-hi75QJbMAKexU4/view?usp=drivesdk",
      "https://drive.google.com/file/d/13GVrsWVqChcsvp5BYaW1zAc0gSK6BvcA/view?usp=drivesdk",
      "https://drive.google.com/file/d/136EKtYvefiZe12zyZBGFvrGPyZ8Jt5ri/view?usp=drivesdk",
      "https://drive.google.com/file/d/13z7fXXLVFfKyaEbRy-sIWYo0GC1xio6K/view?usp=drivesdk",
      "https://drive.google.com/file/d/14vX2XURygJd2AHL4At1_-tmzai61fhvi/view?usp=drivesdk",
      "https://drive.google.com/file/d/121pR8dOngi7MKoKlmcF5_pnuesPcJD2T/view?usp=drivesdk",
      "https://drive.google.com/file/d/125LtVbCFqKIMqpI63S8NsghgrHjig1qG/view?usp=drivesdk",
      "https://drive.google.com/file/d/12uLJ3jvRlVS05aKRNmCv_QkBC0d1dAMg/view?usp=drivesdk",
      "https://drive.google.com/file/d/14hdJdwQVVBi6sZYy_bQAMC-0ojB5p7dO/view?usp=drivesdk",
      "https://drive.google.com/file/d/13jDafKcze8lZ9_Os11nV4wZMe75o6K2p/view?usp=drivesdk",
      "https://drive.google.com/file/d/13-fN4gypFj9GPSp-ImfT4flyv9QoGYFw/view?usp=drivesdk",
      "https://drive.google.com/file/d/14WXUOWjsYz2DOMFiv30cJj0fpz85nrzR/view?usp=drivesdk",
      "https://drive.google.com/file/d/14YeGWR3DXe6Deuos3DE9eurmhYW4rQ3z/view?usp=drivesdk",
      "https://drive.google.com/file/d/13O9GHU1kcCg5Ac-brSxncLnbDhzwblvV/view?usp=drivesdk",
      "https://drive.google.com/file/d/13RLGSArfV7hBdV95Okcz96u3qETg-QJF/view?usp=drivesdk",
      "https://drive.google.com/file/d/14QQoGn-j3TRruOBLat0jcLbJs3eUFryM/view?usp=drivesdk",
      "https://drive.google.com/file/d/14Gdm0ZB7VvwniyjHLUopVHknDuSGAeKs/view?usp=drivesdk",
      "https://drive.google.com/file/d/13K3mArDzKNbdQdWTCq2usG9R96d5uK15/view?usp=drivesdk",
      "https://drive.google.com/file/d/12bQQ5QsomSoOQUOIBZ091YXFje3XEGoI/view?usp=drivesdk",
      "https://drive.google.com/file/d/13-fN4gypFj9GPSp-ImfT4flyv9QoGYFw/view?usp=drivesdk",
      "https://drive.google.com/file/d/14oPDpIrPZ0HWltBBVLjOjfQdVobDpHQx/view?usp=drivesdk",
      "https://drive.google.com/file/d/12wkmN9wi39h4A7LIH3GFohlvUd6VZyhs/view?usp=drivesdk",
      "https://drive.google.com/file/d/13ED592ED3_NoL3ng5xUWkMwItjbXCX2p/view?usp=drivesdk",
      "https://drive.google.com/file/d/141xib1OViRFWOXffdJY2W5tV3wxyS9jX/view?usp=drivesdk",
      "https://drive.google.com/file/d/141IGUqQotFfboMJJCUDzh-2hcesiUC-q/view?usp=drivesdk",
      "https://drive.google.com/file/d/14jy2L7rQ-WIyNXPV7SteQ-RaPhgow7cP/view?usp=drivesdk",
      "https://drive.google.com/file/d/13okKuUf70Vp-N0NIa5tUVqN89SEralUT/view?usp=drivesdk",
      "https://drive.google.com/file/d/120MmuFaRlYcyqk5O1PC30y1Xdo2t-wcY/view?usp=drivesdk",
      "https://drive.google.com/file/d/13-yHYC56FK17IhNSZrgZsdr1f-t1ymoY/view?usp=drivesdk",
      "https://drive.google.com/file/d/12njXeV99pGevz_WaPTr5bAXOoKins8By/view?usp=drivesdk",
      "https://drive.google.com/file/d/14-LDzk_H-GSiUj4Icud2WdUQVRqcG2Og/view?usp=drivesdk",
      "https://drive.google.com/file/d/12S-mcmbSfRR1RrAB6ATnELVQW7wTNTnk/view?usp=drivesdk",
      "https://drive.google.com/file/d/14wwKxVqd1YM73p_ccmdFIQf50aX69ENf/view?usp=drivesdk",
      "https://drive.google.com/file/d/14QKSyofgtDp6jz1fKlF0p97AzdU_AZOk/view?usp=drivesdk",
      "https://drive.google.com/file/d/14BeeuqcyBqDrPJiGbMbDQz3Um71QV2QL/view?usp=drivesdk",
      "https://drive.google.com/file/d/14cIHqxhLNDr1LrsPyz9eLbjYJPkJlJfe/view?usp=drivesdk",
      "https://drive.google.com/file/d/12qunWmhMyVSH6vLY7qfLy5Am794kwe3n/view?usp=drivesdk",
      "https://drive.google.com/file/d/13DBlb9zXCoKY2qcXGAQYafRJb8J3_SyL/view?usp=drivesdk",
      "https://drive.google.com/file/d/14OlvSlMuYWOdtvwA2BdroPdHgy62dcX-/view?usp=drivesdk",
      "https://drive.google.com/file/d/14J7TpA7tqapHlVoirrgP4c4VxVuN0jpm/view?usp=drivesdk",
      "https://drive.google.com/file/d/144IaIRgwLss4EEJ4FYIc6Kk3nrOkE5SE/view?usp=drivesdk",
      "https://drive.google.com/file/d/12Q-Ni-gT0BFFQCuDp-qOYJuZk22-fNdV/view?usp=drivesdk",
      "https://drive.google.com/file/d/14Jnu-LH6e_H_2IeYtdNPuSgHkG3K_qA8/view?usp=drivesdk",
      "https://drive.google.com/file/d/14uluwcKIqxmWxbEb4luUXO7KLcuUO706/view?usp=drivesdk",
      "https://drive.google.com/file/d/12MrFtjJ2J5B3BTO9IauGHKo6d5cF_jlw/view?usp=drivesdk",
      "https://drive.google.com/file/d/13B5Og3ebVKF40CEheiHdl9LfQhDbovZs/view?usp=drivesdk",
    


    ];

    const availableVideos = driveLinks.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomDriveLink = availableVideos[randomIndex];


    const fileId = randomDriveLink.match(/\/d\/(.+?)\//)[1];


    const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

    this.sentVideos.push(randomDriveLink);

    if (senderID !== null) {
      try {
        const response = await axios({
          method: 'GET',
          url: downloadLink,
          responseType: 'stream',
        });

        message.reply({
          body: '',
          attachment: response.data,
        });

        setTimeout(() => {
          api.unsendMessage(loadingMessage.messageID);
        }, 10000);
      } catch (error) {
        console.error('Error downloading video:', error);
        message.reply({
          body: 'Error downloading the video. Please try again later.',
        });
      }
    }
  },
};
