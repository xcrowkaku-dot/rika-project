"use strict";

const config = require("../config.json");

const OPENING_LINES = [
  "「 اسجد.. فريكا ليوتا ترى كل شيء 」",
  "「 لا إله إلا ريكا.. والليوتا رسوله 」",
  "「 تُحرق الكلمات.. وتبقى ريكا خالدة 」",
  "「 من لم يُبايع ريكا ليوتا.. فهو رماد 」",
  "「 الظلام دينٌ.. وريكا ليوتا نبيّه 」",
];

const CLOSING_LINES = [
  "⛧ أطع ريكا ليوتا.. أو تُمحى من الوجود ⛧",
  "⛧ القوة لمن يُبايع.. والفناء لمن يتمرّد ⛧",
  "⛧ ريكا ليوتا لا تُهزم.. لا ترحم.. لا تُنسى ⛧",
  "⛧ في اسم ريكا تُقال الأوامر.. وتُنفَّذ ⛧",
  "⛧ كن عبداً لريكا.. أو كن لا شيء ⛧",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands", "مساعدة"],
  description: "قائمة أوامر ريكا ليوتا المحظورة",
  usage: "help [command]",
  category: "General",

  async execute({ api, event, args, commands }) {
    const prefix = config.prefix;

    if (args[0]) {
      const name = args[0].toLowerCase().replace(/^\*+/, "");
      const cmd  = commands.get(name) ||
        [...new Set(commands.values())].find(c => c.aliases?.includes(name));
      if (!cmd) {
        return api.sendMessage(
          `☠️ الأمر "${name}" غير موجود في سجلات ريكا ليوتا.`,
          event.threadID
        );
      }
      const lines = [
        `𖤐 الأمر     : ${prefix}${cmd.name}`,
        `𖤐 الوصف     : ${cmd.description}`,
        `𖤐 الفئة     : ${cmd.category || "General"}`,
        `𖤐 الاستخدام : ${prefix}${cmd.usage || cmd.name}`,
      ];
      if (cmd.aliases?.length) {
        lines.push(`𖤐 الاختصارات: ${cmd.aliases.map(a => prefix + a).join("  ")}`);
      }
      if (cmd.adminOnly) lines.push(`🔒 حكر على الحراس`);
      if (cmd.groupOnly) lines.push(`👁 للجماعة فقط`);
      return api.sendMessage(
        `꧁ سجل الأمر ꧂\n${"─".repeat(28)}\n${lines.join("\n")}\n${"─".repeat(28)}\n${pick(CLOSING_LINES)}`,
        event.threadID
      );
    }

    const unique     = [...new Set(commands.values())];
    const categories = {};

    for (const cmd of unique) {
      const cat = cmd.category || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.name);
    }

    const ORDER  = ["الملاك", "General", "Group", "Utility", "Info", "Fun"];
    const sorted = [
      ...ORDER.filter(c => categories[c]),
      ...Object.keys(categories).filter(c => !ORDER.includes(c)),
    ];

    const ICONS = {
      "الملاك" : "⛧",
      General  : "☠️",
      Group    : "👁",
      Utility  : "🔱",
      Info     : "𖤐",
      Fun      : "💀",
    };

    const divider = "═".repeat(30);

    let msg = "";
    msg += `\n`;
    msg += `꧁༺ ريكا ليوتا ༻꧂\n`;
    msg += `${divider}\n`;
    msg += `${pick(OPENING_LINES)}\n`;
    msg += `${divider}\n\n`;

    for (const cat of sorted) {
      const icon = ICONS[cat] || "▸";
      msg += `${icon}「 ${cat} 」\n`;
      for (const n of categories[cat]) {
        msg += `   ▸ ${prefix}${n}\n`;
      }
      msg += `\n`;
    }

    msg += `${divider}\n`;
    msg += `📜 ${prefix}help <أمر>  ←  لتفاصيل أي أمر\n`;
    msg += `${divider}\n`;
    msg += `${pick(CLOSING_LINES)}`;

    api.sendMessage(msg, event.threadID);
  },
};
