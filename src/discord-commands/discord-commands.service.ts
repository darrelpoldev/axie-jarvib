
import { DiscordEmbed, FieldValue } from "./discord-commands.interfaces";

export const createMessageWithEmbeded = (discordEmbed: DiscordEmbed): DiscordEmbed => {
    const result: DiscordEmbed = {
        title: discordEmbed.title,
        color: discordEmbed.color || "#37bdcc",
        fields: discordEmbed.fields,
        timestamp: discordEmbed.timestamp,
        footer: discordEmbed.footer
    };

    return result
}

export const createMessageWithEmbededAsync = async (discordEmbed: DiscordEmbed): Promise<DiscordEmbed> => {
    const result: DiscordEmbed = {
        title: discordEmbed.title,
        color: discordEmbed.color || "#37bdcc",
        fields: discordEmbed.fields,
        timestamp: discordEmbed.timestamp,
        footer: discordEmbed.footer
    };

    return result
}