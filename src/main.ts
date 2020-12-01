import dotenv from 'dotenv'
dotenv.config()

import EmailNotifier from './notifiers/email'
import Product from './models/product'
import ProductStalker from './stalkers/product'
import { Amazon, Americanas, Extra, FastShop, PontoFrio } from './watchers'
import MobileNotifier from './notifiers/mobile'
import express from 'express'
import output from './helpers/output'

const PORT = parseInt(process.env.PORT || '80')
const SERVER_MODE = (process.env.SERVER_MODE == 'true')

function watchProduct() {
    const stalker = new ProductStalker({
        timeout: 10000,
        product: new Product(
            'charging-station',
            'Charging Station'
        ), 
        watchers: [
            new Amazon('B08CWG52SV'),
            new Americanas('1991638354'),
            new FastShop('SOECDLSPS5BCO_PRD'),
            new Extra('55010442'),
            new PontoFrio('55010442'),
        ],
        notifiers: [
            // new DesktopNotifier(),
            new EmailNotifier('adilsonxds@gmail.com'),
            new MobileNotifier(),
        ]
    })

    stalker.startMonitoring()
}

main()

async function main() {
    if (SERVER_MODE) {
        await startServer()
    }
    watchProduct()
}

function startServer() : Promise<void> {   
    return new Promise<void>(res => {
        const app = express()

        app.get('/', (req, res) => {
            res.send('The server is running!')
        })
    
        app.listen(PORT, () => {
            output.log(`Listening to port ${PORT}`)
            res()
        })
    })
}