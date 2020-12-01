import nodemailer from 'nodemailer'
import Product from '../models/product'
import Watcher from '../watchers/watcher'
import Notifier from './notifier'

export interface EmailNotifierConfig {
    email: string
}

const emailTemplate = 
`
Hey there!
<br><br>
Your product <b>{PRODUCT_NAME}</b> is available on {STORE_NAME}!<br>
{PRODUCT_URL}
<br>
<br>
Enjoy! 🎉`

export default class EmailNotifier implements Notifier {

    _config: EmailNotifierConfig

    constructor(email: string) {
        this._config = { email }
    }

    name() : string {
        return 'Email'
    }

    notify(product: Product, watcher: Watcher) : Promise<boolean> {
        return new Promise(res => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'palontras.notifier@gmail.com',
                    pass: '@kj26y7s*Y9kDraQ'
                }
            })
            transporter.sendMail({
                from: 'Product Available <palontras.notifier@gmail.com>',
                to: this._config.email,
                subject: `"${product.name}" is available on ${watcher.name()}!`,
                html: emailTemplate
                    .replace('{PRODUCT_NAME}', product.name)
                    .replace('{PRODUCT_URL}', watcher.productUrl())
                    .replace('{STORE_NAME}', watcher.name())
            }, (err, info) => {
                res(!err)
            })
        })
    }
}