import StoreWatcher, { StoreWatcherConfig } from '../watcher'

export class Kabum extends StoreWatcher {
    
    _config: StoreWatcherConfig

    constructor(productId: string) {
        super({
            url: `https://www.kabum.com.br/produto/${productId}/product`
        })
    }

    id(): string {
        return 'Kabum'
    }

    name(): string {
        return 'Kabum'
    }

    validateChange(old: string, current: string): boolean {
        return !current.includes('bot_disponibilidade_off.gif') && !current.includes('"produto_indisponivel"')
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
