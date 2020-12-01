import Product from '../models/product'
import Watcher from '../watchers/watcher'
import Notifier from './notifier'
import axios from 'axios'
import path from 'path'

export default class MobileNotifier implements Notifier {

    name() : string {
        return 'Mobile Notification'
    }

    async notify(product: Product, watcher: Watcher) : Promise<boolean> {
        try {
            const response = await axios({
                url: 'https://api.pushed.co/1/push',
                method: 'POST',
                data: {
                    app_key: 'QcUjT85cB1BWnNs61AVi',
                    app_secret: 'Qk6xELRBTqjzUjp0G10Vk5o3hziALsMHFd33KVBhp2zSOMiwFl7ZXiTzPNLHn77l',
                    target_type: 'app',
                    content_type: 'url',
                    content_extra: watcher.productUrl(),
                    content: `"${product.name}" is available on ${watcher.name()}.`
                }
            })
            return response.status == 200
        }
        catch (e) {
            return false
        }
    }
}