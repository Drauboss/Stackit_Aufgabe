import express, { Express, Request, Response } from 'express';
import { Notification, Notifier, DiscordNotifier } from './services/notification.service';


const app: Express = express();
const PORT: number = 3000;


const notifications: Notification[] = [];

app.use(express.json())


const activeNotifier: Notifier = new DiscordNotifier();

/**
 * GET '/' default endpoint
 */
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'This is an API for forwarding messages to a messaging service' })
})

/**
 * GET '/notifications' endpoint to retrieve all notifications
 */

app.get('/notifications', (req: Request, res: Response) => {
    return res.status(200).json(notifications)
})

/**
 * POST '/notifications' endpoint to receive a notifiction and forward if needed
 */
app.post('/notifications', (req: Request, res: Response) => {
    const notification: Notification = req.body;

    if (!notification || !notification.Type || !notification.Name || !notification.Description) {
        return res.status(400).json({ error: 'Invalid Notification Body!' })
    }

    notifications.push(notification);

    switch (notification.Type) {
        case 'Warning':
            //IDEA: add notifications to a queue to ensure all of them are forwarded
            activeNotifier.send(notification);
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