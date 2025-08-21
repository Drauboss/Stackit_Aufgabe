import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';

//TODO: add timestamp and id
interface Notification {
    Type: 'Warning' | 'Info'; //can add more
    Name: string;
    Description: string;
}

const app: Express = express();
const PORT: number = 3000;

const notifications: Notification[] = [];

app.use(express.json())

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;


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
async function forwardToMessenger(notification: Notification): Promise<void> {
    console.log(notification)
    if (!discordWebhookUrl) {
        console.error('Discord webhook url is invalid or not set.')
        return;
    }

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
        await axios.post(discordWebhookUrl, discordPayload);
        console.log('Succesfully forwarded Notification to discord')
    } catch {
        console.error('Failed to forward Notification to discord')

    }
}

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'This is an API for forwarding messages to a messaging service' })
})

app.get('/notifications', (req: Request, res: Response) => {
    return res.status(200).json(notifications)
})

//TODO: add get method to retrieve specific notification with /notifications/{id}

app.post('/notifications', (req: Request, res: Response) => {
    const notification: Notification = req.body;

    if (!notification || !notification.Type || !notification.Name || !notification.Description) {
        return res.status(400).json({ error: 'Invalid Notification Body!' })
    }

    notifications.push(notification);

    switch (notification.Type) {
        case 'Warning':
            forwardToMessenger(notification);
            return res.status(202).json({ message: 'Notification will be forwarded.' }) //accepted
        case 'Info':
            return res.status(204).send() //no content
        default:
            return res.status(400).json({ error: 'Notification Type is not valid.' })
    }
})

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;