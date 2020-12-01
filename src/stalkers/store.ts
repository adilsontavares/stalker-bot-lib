import path from 'path'
import fs, { watch } from 'fs'
import axios from 'axios'
import chalk from 'chalk'
import Product from '../models/product'
import StoreWatcher, { StoreWatcherConfig } from '../watchers/watcher'
import Sleep from '../helpers/sleep'
import NodeNotifier, { NotificationMetadata } from 'node-notifier'

export enum StoreStalkerStatus {
    InitialDataFullfilled,
    Changed,
    NoChange,
    Notify,
    Failed,
}

export interface StoreStalkerRequestResult {
    status: StoreStalkerStatus
    error?: any
}

export default class StoreStalker {

    product: Product
    watcher: StoreWatcher

    _defaultTimeout = 30 * 1000
    _lastResponse: string
    _responsePath: string = ''
    _events: { [name: string]: () => void } = {}

    constructor(product: Product, watcher: StoreWatcher) {
        
        this.product = product
        this.watcher = watcher

        const localCachePath = path.join(__dirname, '../../.cache')
        this._responsePath = path.join(localCachePath, `${product.id}-${watcher.id()}.${watcher.fileExtension()}`)

        if (fs.existsSync(this._responsePath)) {
            this._lastResponse = fs.readFileSync(this._responsePath, 'utf-8')
        }
    }

    _wait(ms: number) : Promise<void> {
        return new Promise((res) => {
            setTimeout(() => res(), ms)
        })
    }

    async request() : Promise<StoreStalkerRequestResult> {
        try {

            const response = await axios.get(this.watcher.config.url, {
                timeout: 10000,
                headers: this.watcher.headers()
            })

            let data = response.data

            if (typeof(data) === 'object') {
                data = JSON.stringify(data)
            }

            if (response.status == 200 && data != this._lastResponse) {

                let lastResponseWasEmpty = !this._lastResponse

                let olderResponse = this._lastResponse
                this._lastResponse = data
                fs.writeFileSync(this._responsePath, this._lastResponse, 'utf-8')

                if (!lastResponseWasEmpty) {
                    if (this.watcher.validateChange(olderResponse, this._lastResponse)) {
                        return { status: StoreStalkerStatus.Notify }
                    }
                    return { status: StoreStalkerStatus.Changed }
                }
                return { status: StoreStalkerStatus.InitialDataFullfilled }
            }
            
            return { status: StoreStalkerStatus.NoChange }
        }
        catch (e) {
            return {
                status: StoreStalkerStatus.Failed,
                error: e
            }
        }
    }
}