"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageWithEmbeded = void 0;
var createMessageWithEmbeded = function (discordEmbed) {
    var result = {
        title: discordEmbed.title,
        color: discordEmbed.color || "#37bdcc",
        fields: discordEmbed.fields,
        timestamp: discordEmbed.timestamp,
        footer: discordEmbed.footer
    };
    return result;
};
exports.createMessageWithEmbeded = createMessageWithEmbeded;
