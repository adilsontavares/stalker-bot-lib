import StoreWatcher, { StoreWatcherConfig } from '../watcher'

export class PontoFrio extends StoreWatcher {
    
    _config: StoreWatcherConfig

    constructor(productId: string) {
        super({
            url: `https://pdp-api.pontofrio.com.br/api/v2/sku/${productId}/price/source/EX?device_type=MOBILE`
        })
    }

    id(): string {
        return 'pontofrio'
    }

    name(): string {
        return 'Ponto Frio'
    }

    validateChange(old: string, current: string): boolean {
        return !current.includes('"buyButtonEnabled":false')
    }

    productUrl() : string {
        return this._config.url
    }

    fileExtension(): string {
        return 'json'
    }
    
    headers(): { [name: string]: string } {
        return undefined
    }
}
