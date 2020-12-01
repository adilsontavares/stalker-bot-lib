import Product from '../models/product'
import Watcher from '../watchers/watcher'
import Notifier from './notifier'
import NodeNotifier, { NotificationMetadata } from 'node-notifier'
import path from 'path'

export default class NotificationNotifier implements Notifier {

    name() : string {
        return 'Notification'
    }

    async notify(product: Product, watcher: Watcher) : Promise<boolean> {
        NodeNotifier.notify({
            title: `${watcher.name()} updated!`,
            message: "Click to see what's new.",
            wait: true,
            timeout: 9999,
            icon: path.join(__dirname, '../../icons/warning.png'),
            open: watcher.productUrl()
        }, (err: Error | null, response: string, metadata?: NotificationMetadata) => {
            
        })
        return true
    }
}