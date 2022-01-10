export interface FieldValue {
    name: string;
    value: string;
    inline: boolean;
}

export interface Footer {
    text: string;
}

export interface DiscordEmbed {
    color?: string;
    fields: FieldValue[];
    timestamp?: Date;
    footer?: Footer;
}
