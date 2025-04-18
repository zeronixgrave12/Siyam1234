module.exports = {
	config: {
		name: "unsend",
		aliases: ["un", "u", "uns", "unsent"],
		version: "1.2",
		author: "NTKhang | Modified by Amit Max ⚡",
		countDown: 5,
		role: 0,
		description: {
			en: "ভুল হলে মুছে দিও… যেমন চুপচাপ ভালোবাসি তোমায় 🫣❤️"
		},
		category: "box chat",
		guide: {
			en: "রিপ্লাই দাও মেসেজটাতে আর লিখো {pn}… কিছু কথা চিরকাল মনে রাখা যায় না 🥀"
		}
	},

	langs: {
		en: {
			syntaxError: "রিপ্লাই করো মেসেজটায়… না হলে কীভাবে মুছবো? চলো হারিয়ে যাই চুপচাপ… 🫶💬"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
			return message.reply(getLang("syntaxError"));
		message.unsend(event.messageReply.messageID);
	}
};
