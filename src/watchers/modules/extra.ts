import StoreWatcher, { StoreWatcherConfig } from '../watcher'
import { PontoFrio } from './pontofrio'

export class Extra extends PontoFrio {
    
    _config: StoreWatcherConfig

    constructor(productId: string) {
        super(productId)
        this._config = {
            url: `https://pdp-api.extra.com.br/api/v2/sku/${productId}/price/source/EX?device_type=MOBILE`
        }
    }

    id(): string {
        return 'extra'
    }

    name(): string {
        return 'Extra'
    }
    
    headers(): { [name: string]: string } {
        return undefined
    }
}
