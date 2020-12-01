import StoreWatcher, { StoreWatcherConfig } from '../watcher'

export class FastShop extends StoreWatcher {
    
    _config: StoreWatcherConfig

    constructor(productId: string) {
        super({
            url: `https://www1.fastshop.com.br/product,product,${productId}.aspx`
        })
    }

    id(): string {
        return 'fastshop'
    }

    name(): string {
        return 'Fast Shop'
    }

    validateChange(old: string, current: string): boolean {
        return !current.includes('"ctl00_body_msgIndisponivel"')
    }

    productUrl() : string {
        return this._config.url
    }

    fileExtension(): string {
        return 'html'
    }
    
    headers(): { [name: string]: string } {
        return undefined
    }
}
