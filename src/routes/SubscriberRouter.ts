import {Router, Request, Response, NextFunction} from 'express';
import Db from '../Db';
import Push from '../Push';

var pushSubscriptionSchema = new Db.mongoose.Schema({
    created: Date,
    psobject: {
        endpoint: String, 
        expirationTime: Number, 
        keys: {
            p256dh: String, 
            auth: String
        }
    }
});
var PushSubscription = Db.mongoose.model('PushSubscription', pushSubscriptionSchema);

export class SubscriberRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public setOne(req, res) {
        let pushSubscription = new PushSubscription();
        pushSubscription['created'] = Date.now();
        pushSubscription['psobject'] = req.body;
        

        pushSubscription.save(err => {
            if (err) res.send(err);
            console.log('New subscriber stored');
            res.json({message: 'Data correctly stored'});
        });
    }

    public sendAll(req, res) {

        const notificationPayload = {
            "notification": {
                "title": req.body.title,
                "body": req.body.body,
                "icon": "assets/icon-128x128.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };

        PushSubscription.find((err, pushSubscriptions) => {
            if (err) res.send(err);

            Promise.all(pushSubscriptions.map(sub => Push.sendNotification(
                sub['psobject'], JSON.stringify(notificationPayload)
            )))
            .then(() => res.status(200).json({message: 'Notification sent successfully.'}))
            .catch((err) => {
                console.error("Error sending notification, reason: ", err);
                res.sendStatus(500);
            });
        });
    }

    init() {
        this.router.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        })
        this.router.post('/', this.setOne);
        this.router.post('/sendAll', this.sendAll);
    }
}

const subscriberRoutes = new SubscriberRouter();
subscriberRoutes.init();

export default subscriberRoutes.router;