import request from "supertest";
import app from "./index";

describe('Notifiactions API', () => {
    test('Test POST /notifications - should forward a Warning typed notification', async () => {
        const warningNotification = {
            Type: 'Warning',
            Name: 'Backup Failure',
            Description: 'The backup failed due to a database problem'
        }

        const response = await request(app)
            .post('/notifications')
            .send(warningNotification);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Notification will be forwarded.')
    });

    test('Test POST /notifications - should not forward a Info typed notification', async () => {
        const infoNotification = {
            Type: 'Info',
            Name: 'Quota Exceeded',
            Description: 'Compute Quota exceeded'
        }

        const response = await request(app)
            .post('/notifications')
            .send(infoNotification);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Notification will not be forwarded.')
    })

    test('Test POST /notifications - should not forward a invalid typed notification', async () => {
        const invalidTypedNotification = {
            Type: 'Invalid',
            Name: 'Quota Exceeded',
            Description: 'Compute Quota exceeded'
        }

        const response = await request(app)
            .post('/notifications')
            .send(invalidTypedNotification);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Notification Type is not valid.')
    })


    test('Test POST /notifications - should not forward a invalid notification', async () => {
        const invalidNotification = {
            Type: 'Invalid'
        }

        const response = await request(app)
            .post('/notifications')
            .send(invalidNotification);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Invalid Notification Body!')
    })



})