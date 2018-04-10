import * as webpush from 'web-push';
import * as dotenv from 'dotenv';

class Push {
    public webpush = webpush;

    constructor() {
        this.webpush.setVapidDetails(
            `mailto:${process.env.VAPID_CONTACT_MAIL}`,
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        );
    }
}

export default new Push().webpush;