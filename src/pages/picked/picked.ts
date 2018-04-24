import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { PackPage } from '../pack/pack';

@Component({
  selector: 'page-picked',
  templateUrl: 'picked.html',
})
export class PickedPage {

  pickedOrders: Array<any>;
  isChecked: boolean;
  pickedOrder_id: string;
  pickedOrder_orderId: number;
  pickedOrder_orderName: string;

  constructor(public nav: NavController,  public orderService: OrderServiceProvider) {
    // get picked list from firebase
    this.pickedOrders = this.orderService.getPickedList();
    // important for loading page
    this.pickedOrders[0].orderName;
    this.isChecked = false;
    
  }

  getPickedOrder( _pickedOrder_orderId: number, _pickedOrder_orderName: string) {
    this.isChecked = true;
   
    this.pickedOrder_orderId = _pickedOrder_orderId;
    this.pickedOrder_orderName = _pickedOrder_orderName;
   
  }

  showProducts() {
    // redirect to new page to show all products in order
   
    this.nav.push(PackPage, {pickedOrder_orderId: this.pickedOrder_orderId, pickedOrder_orderName: this.pickedOrder_orderName});
  }

  doRefresh(refresher) {
    // get picked list from firebase
    this.pickedOrders = this.orderService.getPickedList();
    // important for loading page
    this.pickedOrders[0].orderName;
    this.isChecked = false;

    setTimeout(() => {
      refresher.complete();
    }, 1500);

  }

  
}
