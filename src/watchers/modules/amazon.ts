import StoreWatcher, { StoreWatcherConfig } from '../watcher'

export class Amazon extends StoreWatcher {
    
    _config: StoreWatcherConfig

    constructor(productId: string) {
        super({
            url: `https://www.amazon.com.br/dp/${productId}/ref=wl_mb_wl_huc_clickstream_3_dp`
        })
    }

    id(): string {
        return 'amazon'
    }

    name(): string {
        return 'Amazon'
    }

    validateChange(old: string, current: string): boolean {
        return !current.includes('Não temos previsão de quando este produto estará disponível novamente.')
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
