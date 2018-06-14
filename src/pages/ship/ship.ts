import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
     this.shipment = navParams.get('shipment');
     this.shipment.weight = Number((this.shipment.weight / 1000).toFixed(1));
     this.nullWeightItems = navParams.get('nullWeightItems');
  }

  createShipLabel() {
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}
