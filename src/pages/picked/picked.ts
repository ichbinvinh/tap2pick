import { Component, ViewChild } from '@angular/core';
import { NavController, Refresher, AlertController } from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { PackPage } from '../pack/pack';

@Component({
  selector: 'page-picked',
  templateUrl: 'picked.html',
})
export class PickedPage {
  @ViewChild(Refresher) refresher: Refresher;

  pickedOrders: Array<any>;
  isChecked: boolean;
  pickedOrder_id: string;
  pickedOrder_orderId: number;
  pickedOrder_orderName: string;

  constructor(public nav: NavController, 
               public orderService: OrderServiceProvider,
               public alertCtrl: AlertController) {
    // get picked list from firebase
    this.pickedOrders = this.orderService.getPickedList();
    // important for loading page
    this.pickedOrders[0].orderName;
    this.isChecked = false;
    
  }

  getPickedOrder(_pickedOrder_id: string, _pickedOrder_orderId: number, _pickedOrder_orderName: string) {
    this.isChecked = true;
    
    this.pickedOrder_id = _pickedOrder_id;
    this.pickedOrder_orderId = _pickedOrder_orderId;
    this.pickedOrder_orderName = _pickedOrder_orderName;
   
  }

  showProducts() {
    // redirect to new page to show all products in order
   
    this.nav.push(PackPage, {pickedOrder_orderId: this.pickedOrder_orderId, pickedOrder_orderName: this.pickedOrder_orderName});
  }

  delete() {
      

      let alert = this.alertCtrl.create({
        title: 'Confirm save',
        message: 'Are you sure to delete this picked order?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: 'Ok',
            handler: () => {
             
              this.orderService.deletePickedOrder(this.pickedOrder_id);
              this.refresher._top = '50px';
              this.refresher.state = 'refreshing';
              this.refresher._beginRefresh();
            }
          }
        ]
      });
      alert.present();
  
    
  }

  doRefresh(refresher) {

    setTimeout(() => {
      refresher.complete();
    }, 1500);

    this.isChecked = false;

    // get picked list from firebase
    this.pickedOrders = this.orderService.getPickedList();
    // important for loading page
    this.pickedOrders[0].orderName;
    

    
  }

  
}
