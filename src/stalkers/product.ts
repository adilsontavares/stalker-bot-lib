import Product from '../models/product'
import StoreWatcher from '../watchers/watcher'
import StoreStalker, { StoreStalkerStatus } from './store'
import NodeNotifier, { NotificationMetadata, notify } from 'node-notifier'
import Sleep from '../helpers/sleep'
import chalk from 'chalk'
import readline from 'readline'
import Notifier from '../notifiers/notifier'
import { config } from 'process'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

export interface ProductStalkerConfig {
    product: Product
    watchers: StoreWatcher[]
    notifiers?: Notifier[]
    timeout?: number
}

export default class ProductStalker {

    _config: ProductStalkerConfig
    _product: Product
    _storeStalkers: StoreStalker[]
    _maxWatcherNameLength = 0
    _previousStatus: { [name: string]: string } = {}
    _cursorLine = 0

    constructor(config: ProductStalkerConfig) {
        
        this._config = config
        this._product = config.product
        this._config.notifiers = this._config.notifiers || []
        this._storeStalkers = config.watchers.map(x => new StoreStalker(config.product, x))
        this._maxWatcherNameLength = Math.max(...this._storeStalkers.map(x => x.watcher.name().length))

        for (let stalker of this._storeStalkers) {
            this._previousStatus[stalker.watcher.id()] = '~'
        }

        console.log()
        console.log(`Stalking "${config.product.name}" on ${this._storeStalkers.length} stores:`)
        console.log()

        this._printAllPreviousStatus()

        process.stdout.write(`\x1B[${this._storeStalkers.length}A`)
    }

    _printAllPreviousStatus() {
        for (let stalker of this._storeStalkers) {
            this._printStatus(stalker.watcher, this._previousStatus[stalker.watcher.id()])
        }
    }

    async startMonitoring() {

        const timeout = this._config.timeout || (30 * 1000)
        const deltaTimeout = Math.round(timeout / this._storeStalkers.length)

        while (true) {
            for (let i = 0; i < this._storeStalkers.length; ++i) {

                let stalker = this._storeStalkers[i]

                for (let j = deltaTimeout; j > 0; j -= 1000) {
                    this._printStatus(stalker.watcher, this._previousStatus[stalker.watcher.id()], false)
                    process.stdout.write(` next in ${j / 1000}s\r`)
                    await Sleep(1000)
                }

                this._printStatus(stalker.watcher, 'requesting...', false)
                process.stdout.write('\r')

                const result = await stalker.request()
                let status = "unknown"

                switch (result.status)
                {
                    case StoreStalkerStatus.InitialDataFullfilled:
                        status = chalk.bold("initial data")
                        break

                    case StoreStalkerStatus.NoChange:
                        status = "no change"
                        break

                    case StoreStalkerStatus.Changed:
                        status = chalk.yellow("changed")
                        break

                    case StoreStalkerStatus.Notify:
                        status = chalk.green("notify")
                        break

                    case StoreStalkerStatus.Failed:
                        const errorCode = result.error.response?.status || -1
                        status = chalk.red(`failed (${errorCode})`)
                        break
                }

                this._previousStatus[stalker.watcher.id()] = status
                this._printStatus(stalker.watcher, status)
                this._cursorLine += 1

                if (result.status == StoreStalkerStatus.Notify) {

                    process.stdout.write(`\x1B[${this._storeStalkers.length - this._cursorLine}B\r`)
                    console.log()
                    console.log(`>>> 🥳 ${stalker.watcher.name()} was updated!`)
                    console.log(`>>> Check in out: ${stalker.watcher.productUrl()}`)
                    console.log()

                    const notifiers = this._config.notifiers
                    if (notifiers.length > 0) {
                        for (let notifier of notifiers) {
                            process.stdout.write(`Triggering "${notifier.name()}": ...\r`)
                            let ok = await notifier.notify(this._product, stalker.watcher)
                            process.stdout.clearLine(1)
                            process.stdout.write(`Triggering "${notifier.name()}": ${ok ? chalk.green('Ok') : chalk.red('Failed')}\n`)
                        }
                        console.log()
                    }

                    await this._waitForReturn()
                    process.stdout.write(`\x1B[${this._storeStalkers.length + 5 + (this._config.notifiers.length > 0 ? this._config.notifiers.length + 1 : 0)}A\r`)
                    process.stdout.clearScreenDown()
                    this._printAllPreviousStatus()
                    process.stdout.write(`\x1B[${this._storeStalkers.length - this._cursorLine}A\r`)
                }
            }

            this._cursorLine = 0
            process.stdout.write(`\x1B[${this._storeStalkers.length}A`)
        }
    }

    async _waitForReturn() : Promise<void> {
        return new Promise(res => {
            rl.question('Press RETURN to continue.', () => res())
        })
    }

    _printStatus(watcher: StoreWatcher, status: string, newLine: boolean = true) {
        const title = watcher.name().padEnd(this._maxWatcherNameLength + 1, ' ')
        const text = `${title} [${status}]`

        process.stdout.clearLine(1)

        if (newLine) {
            console.log(text)
        } else {
            process.stdout.write(text)
        }
    }
}