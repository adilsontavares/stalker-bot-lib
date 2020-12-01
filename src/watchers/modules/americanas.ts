import StoreWatcher, { StoreWatcherConfig } from '../watcher'

export class Americanas extends StoreWatcher {
    
    _config: StoreWatcherConfig

    constructor(productId: string) {
        super({
            url: `https://www.americanas.com.br/produto/${productId}`
        })
    }

    id(): string {
        return 'americanas'
    }

    name(): string {
        return 'Americanas'
    }

    validateChange(old: string, current: string): boolean {
        return !current.includes('produto sem estoque :(')
    }
    
    productUrl() : string {
        return this._config.url
    }

    fileExtension(): string {
        return 'html'
    }
    
    headers(): { [name: string]: string } {
        return {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36',
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        }
    }
}
