import express, { Express, Request, Response } from 'express';

interface Notification {
    Type: 'Warning' | 'Info'; //can add more
    Name: string;
    Description: string;
}

const app: Express = express();
const PORT: number = 3000;

const notifications: Notification[] = [];

app.use(express.json())

//TODO: change to something more suitable
function forwardToMessenger(notification: Notification): void {
    console.log(notification)
}

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'This is an API for forwarding messages to a messaging service' })
})

app.post('/notifications', (req: Request, res: Response) => {
    const notification: Notification = req.body;

    if (!notification || !notification.Type || !notification.Name || !notification.Description) {
        return res.status(400).json({ error: 'Invalid Notification Body!' })
    }

    notifications.push(notification);

    switch (notification.Type) {
        case 'Warning':
            forwardToMessenger(notification);
            return res.status(200).json({ message: 'Notification will be forwarded.' })
        case 'Info':
            return res.status(200).json({ message: 'Notification will not be forwarded.' })
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