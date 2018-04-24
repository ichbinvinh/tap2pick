import { Component } from '@angular/core';
import {App, NavController, LoadingController, Loading } from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { PickPage } from '../pick/pick';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public orders:any;
  public ordersToPick: Array<number>;
  public orderNameToPick: Array<number>;
  public readyToPick: boolean;
  dateList: Array<string>;
  pageno: number = 1;
  totalPageNumber: number;
  totalUnfulfilledOrders: number;
  loading: Loading;

  constructor(private app: App,private secureStorage: SecureStorage, private loadingCtrl: LoadingController, public nav: NavController,  public orderService: OrderServiceProvider) {
    this.loadOrders();
    this.ordersToPick = new Array<number>();
    this.orderNameToPick = new Array<number>();
    
    this.orderService.countUnfulfilledOrders().then(data => {
      this.totalUnfulfilledOrders = <number> data;
    })

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loading.present();
  }

  loadOrders() {
   
      this.orders = null;
      this.orderService.loadOrdersByPage(this.pageno).then(data => {
      this.orders = data;
      this.orders.forEach(order => {
          // set to be unchecked
          order.order_number = false;
      });

      });

    }

  updateOrdersToPick(checked: boolean, id: number, name: number) {
      if(checked) {
        this.ordersToPick.push(id);
        this.orderNameToPick.push(name);
      } else {
        // remove order in ordersToPick
        let idx = this.ordersToPick.indexOf(id);
        if(idx > -1) {
          this.ordersToPick.splice(idx, 1);
          this.orderNameToPick.splice(idx, 1);
        }
          
      }

      // check to view pick button
      if(this.ordersToPick.length > 0)
        this.readyToPick = true;
      else
        this.readyToPick = false;  
    }

  pick() {
     // redirect to picking page
     this.nav.push(PickPage, {ordersToPick: this.ordersToPick, ordersToPickName: this.orderNameToPick, productList: '', id: ''});
  }  

  

doInfinite(infiniteScroll) {
  this.pageno++;
    this.orderService.loadOrdersByPage(this.pageno).then(result =>{
          let orders: any = result;
        for(let order of orders) {
          let idx = this.orders.indexOf(order);
          if(idx == -1) {
            order.order_number = false;
            this.orders.push(order);
          }
            
        }
      });
      infiniteScroll.complete();
       
} 

doRefresh(refresher) {
  this.pageno = 1;
  this.ordersToPick = new Array<number>();
  this.readyToPick = false;
  
   this.loadOrders();
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
