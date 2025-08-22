import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export interface Notification {
    Type: 'Warning' | 'Info'; //can add more
    Name: string;
    Description: string;
}

export interface Notifier {
    send(notification: Notification): Promise<void>;
}

export class DiscordNotifier implements Notifier {

    private webhookUrl: string;

    constructor() {
        const url = process.env.DISCORD_WEBHOOK_URL;
        if (!url) {
            throw new Error('Discord Webhook URL is invalid or not set')
        }
        this.webhookUrl = url;
    }

    /**
     * Forwards a notification to a Discord channel using a webhook.
     *
     * The function constructs a Discord embed payload from the provided `Notification` object
     * and sends it to the Discord webhook URL. If the webhook URL is not set or invalid,
     * it logs an error and returns early. On success or failure of the HTTP request,
     * it logs the corresponding message.
     *
     * @param notification - The notification object containing details to be sent.
     * @returns A promise that resolves when the notification has been forwarded.
     */
    async send(notification: Notification): Promise<void> {
        console.log(notification)

        const discordPayload = {
            embeds: [
                {
                    title: `Warning: ${notification.Name}`,
                    description: notification.Description,
                    color: 15158332,
                    fields: [
                        {
                            name: 'Type',
                            value: notification.Type,
                            inline: true
                        },
                        {
                            name: 'Timestamp',
                            value: new Date().toISOString(),
                            inline: true
                        }
                    ],
                    footer: {
                        text: 'Automated Notifications Service'
                    }
                }
            ]
        }

        try {
            await axios.post(this.webhookUrl, discordPayload);
            console.log('Succesfully forwarded Notification to discord')
        } catch {
            console.error('Failed to forward Notification to discord')

        }
    }
}

//IMPLEMENT
export class TelegramNotifier implements Notifier {
    async send() { }
}

//IMPLEMENT
export class SlackNotifier implements Notifier {
    async send() { }
}