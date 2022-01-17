export interface FieldValue {
    name: string;
    value: string;
    inline: boolean;
}

export interface Footer {
    text: string;
}

export interface DiscordEmbed {
    title?: string,
    color?: string;
    fields: FieldValue[];
    timestamp?: Date;
    footer?: Footer;
}
