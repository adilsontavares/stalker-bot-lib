import EmailNotifier from './notifiers/email'
import DesktopNotifier from './notifiers/desktop'
import Product from './models/product'
import ProductStalker from './stalkers/product'
import { Amazon, Americanas, Extra, FastShop, PontoFrio } from './watchers'
import MobileNotifier from './notifiers/mobile'

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
        // new EmailNotifier('adilsonxds@gmail.com'),
        new MobileNotifier(),
    ]
})

stalker.startMonitoring()
