import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';

@Component({
  selector: 'page-ship',
  templateUrl: 'ship.html',
})
export class ShipPage {

  shipment = {
              firstname: '',
              lastname: '',
              street: '',
              streetno: '',
              city: '',
              plz: '',
              country: '',
              telephone: '',
              weight: 0,
              package: '',
              description: '',
              carrier: '',
              service: '',
              packagetype: ''
          
            };
  nullWeightItems : string;
  pickedOder_orderId: string;          

  constructor(public viewCtrl: ViewController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public orderService: OrderServiceProvider) {
                
     this.shipment = navParams.get('shipment');
     this.shipment.weight = Number((this.shipment.weight / 1000).toFixed(1));
     this.nullWeightItems = navParams.get('nullWeightItems');
     this.pickedOder_orderId = navParams.get('pickedOder_orderId');
  }

  createShipLabel() {
    // create shiplabel

    // update status as labeled for picked order
    this.orderService.updateStatusPickedOrder(this.pickedOder_orderId);

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}
