export interface StoreWatcherConfig {
    url: string
}

export default abstract class StoreWatcher {

    _config: StoreWatcherConfig
    get config(): StoreWatcherConfig { return this._config }

    constructor(config: StoreWatcherConfig) {
        this._config = config
    }

    abstract id() : string
    abstract name() : string
    abstract validateChange(old: string, current: string) : boolean
    abstract productUrl() : string
    abstract fileExtension() : string
    abstract headers(): { [name: string]: string }
}