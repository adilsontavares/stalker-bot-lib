import Product from '../models/product'
import Watcher from '../watchers/watcher'

export default interface Notifier {
    name() : string
    notify(product: Product, watcher: Watcher) : Promise<boolean>
}