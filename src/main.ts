import EmailNotifier from './notifiers/email'
import NotificationNotifier from './notifiers/notification'
import Product from './models/product'
import ProductStalker from './stalkers/product'
import { Amazon, Americanas, Extra, FastShop, PontoFrio } from './watchers'

const stalker = new ProductStalker({
    timeout: 10000,
    product: new Product(
        'charging-station',
        'Charging Station'
    ), 
    watchers: [
        new Americanas('1991638354'),
        new FastShop('SOECDLSPS5BCO_PRD'),
        new Amazon('B08CWG52SV'),
        new Extra('55010442'),
        new PontoFrio('55010442'),
    ],
    notifiers: [
        new NotificationNotifier(),
        new EmailNotifier('adilsonxds@gmail.com'),
    ]
})

stalker.startMonitoring()
