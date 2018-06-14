import { Component, ViewChild } from '@angular/core';
import {App, Refresher, IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
  @ViewChild(Refresher) refresher: Refresher;

  pickingList: Array<any>;
  readyToPick: boolean;
  pickingListId: string;
  ordersToPickName: string;
  productList: string;
  id: string;
  pickerName: string;
 
  constructor(private app: App, 
              private secureStorage: SecureStorage, 
              public nav: NavController, 
              public orderService: OrderServiceProvider, 
              public alertCtrl: AlertController,
              public navCtrl: NavController,
              public viewCtrl: ViewController, 
              public navParams: NavParams) {

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
    this.nav.push(PickPage, {ordersToPick: this.pickingListId.split('#'), ordersToPickName: this.ordersToPickName.split('#'), productList: this.productList, id: this.id});
  }

  delete() {
    
    let alert = this.alertCtrl.create({
      title: 'Confirm save',
      message: 'Are you sure to delete this picking order?',
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
           
            this.orderService.deletePickingOrder(this.id);
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

    // unselect oder
    this.readyToPick = false;

    // get picking list from firebase
    this.pickingList = this.orderService.getPickingList();
    // important for loading page
    this.pickingList[0].orderNames;
  
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
