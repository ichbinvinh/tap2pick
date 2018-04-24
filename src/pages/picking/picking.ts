import { Component } from '@angular/core';
import {App,  IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { PickPage } from '../pick/pick';
import { LoginPage } from '../login/login';




@IonicPage()
@Component({
  selector: 'page-picking',
  templateUrl: 'picking.html',
})
export class PickingPage {

  pickingList: Array<any>;
  readyToPick: boolean;
  pickingListId: string;
  ordersToPickName: string;
  productList: string;
  id: string;
  pickerName: string;


  constructor(private app: App, private secureStorage: SecureStorage, public nav: NavController, public orderService: OrderServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
    // get picking list from firebase
    this.pickingList = this.orderService.getPickingList();
    // important for loading page
    this.pickingList[0].orderNames;


  }

  recreatePickList(id: string, pickingListId: string, ordersToPickName: string, productList: string) {
    
    this.readyToPick = true;
    this.pickingListId = pickingListId;
    this.ordersToPickName = ordersToPickName;
    this.productList = productList;
    this.id = id;
  }

  pick() {
    
    // redirect to picking page
    this.nav.push(PickPage, {ordersToPick: this.pickingListId.split('#'), ordersToPickName: this.ordersToPickName, productList: this.productList, id: this.id});
  }

  doRefresh(refresher) {
    // get picking list from firebase
    this.pickingList = this.orderService.getPickingList();
    // important for loading page
    this.pickingList[0].orderNames;

    setTimeout(() => {
      refresher.complete();
    }, 1500);

  }

  logout() {

    this.secureStorage.create('tap2pick').then((storage: SecureStorageObject) => {
            
      storage.set('rememberMe', 'false');
      storage.set('pickerName', '');
      var nav = this.app.getRootNav();
      nav.setRoot(LoginPage);
   
    });
  
  }


}
