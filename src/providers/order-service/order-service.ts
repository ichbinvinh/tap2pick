import { Injectable } from '@angular/core';
import { HttpClientProvider } from '../http-client/http-client';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from 'firebase';

@Injectable()
export class OrderServiceProvider {

  data: any;
  ORDERS_PER_PAGE = 10;

  pickingOrders: AngularFireList<any>;
  pickedOrders: AngularFireList<any>;
  pickingList: Array<any>;
  pickedList: Array<any>;
  loadedPickingList: Array<any>;
  public pickingOrdersRef: firebase.database.Reference;
  
  constructor(public http: HttpClientProvider, private afDatabase: AngularFireDatabase,) {
    this.pickingOrders = this.afDatabase.list('pickingOrders');
    //this.packList = this.afDatabase.list('packList');
    this.pickedOrders = this.afDatabase.list('pickedOrders');
  }

  getPickingList() {
      
    this.pickingOrdersRef = firebase.database().ref('/pickingOrders');
    this.pickingOrdersRef.on('value', pickingList => {
      let lists= [];
      pickingList.forEach(list => {
       
        lists.push(list.val());
        return false;
      });
      this.pickingList = lists;
      
    });
    return this.pickingList.reverse();
  }

  getPickedList() {
      
    this.pickingOrdersRef = firebase.database().ref('/pickedOrders');
    this.pickingOrdersRef.on('value', pickedList => {
      let lists= [];
      pickedList.forEach(list => {
        lists.push(list.val());
        return false;
      });
      this.pickedList = lists;
      
    });
    return this.pickedList.reverse();
  }

  updatePickingOrders(pickingOrderId: string, updatedPickingProductList: string) {

    this.pickingOrders.update(pickingOrderId, {productList: updatedPickingProductList});
    
    // this.afDatabase.list('/pickingOrders')
    // .update(pickingOrderId ,{productList: updatedPickingProductList});
  
  }

  updateStatusPickingOrders(pickingOrderId: string) {
    this.pickingOrders.update(pickingOrderId, {status: 'picked'});
  }

  deletePickingOrder(pickingOrderId: string) {
    this.pickingOrders.remove(pickingOrderId);
  }

  deletePickedOrder(pickedOrderId: string) {
    this.pickedOrders.remove(pickedOrderId);
  }

  // addPackingOrders(_orderIds: string, products: string) {
  //   this.pickingOrders.push({
  //     orderIds: _orderIds,
  //     productList: products,
  //     date: new Date().toISOString(),
  //     status: "full"
  //   });

  // }

  addPackedOrders(_orderIds: Array<number>, _orderNames: Array<number>, _pickerName: string) {

    for(let i = 0; i<_orderIds.length; i++) {
      const newPickedOrderRef = this.pickedOrders.push({});
        newPickedOrderRef.set({
        id: newPickedOrderRef.key,
        orderId: _orderIds[i],
        //orderName:  _orderNames.toString().split('#')[i],
        orderName:  _orderNames.length>1?_orderNames[i]:_orderNames,
        date: new Date().toISOString(),
        status: "picked",
        pickerName: _pickerName
      });
    }

  }

  savePickingOrders(_orderIds: string, _orderNames: string,products: string, _pickerName: string) {
    // this.pickingOrders.push({
    //   orderIds: _orderIds,
    //   orderNames: _orderNames,
    //   productList: products,
    //   date: new Date().toISOString(),
    //   status: "picking"
    // });
    const newPickingOrderRef = this.pickingOrders.push({});
    newPickingOrderRef.set({
        id: newPickingOrderRef.key,
        orderIds: _orderIds,
        orderNames: _orderNames,
        productList: products,
        date: new Date().toISOString(),
        status: "picking",
        pickerName: _pickerName
    });

  }

  loadOrders() {
    return new Promise(resolve => {  
     // load  Orders of shop
            this.http.get('https://giaohang.myshopify.com/admin/orders.json?status=any')
         
          .map(response => response.json().orders)
          .subscribe(data => {
                            
                            this.data = data;
                           
                            resolve(this.data);
                            }); 
        
      
       }); 
}

loadShipLabel(id: string) {
  alert("preparing get ship lable");
  return new Promise(resolve => {  
    // load  Orders of shop
           this.http.getShipCloud('https://api.shipcloud.io/v1/shipments/'+id)
           .map(res => res.json().label_url)
           .subscribe(data => {
             this.data = data;
             resolve(this.data);
           });
       });
}

loadShippingAddressByOrderId(orderId: number) {
  return new Promise(resolve => {
       
    this.http.get('https://giaohang.myshopify.com/admin/orders/'+orderId+'.json?fields=shipping_address')
      .map(res => res.json().order.shipping_address)
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
  });

}

loadOrdersByPage(pageno: number) {
  return new Promise(resolve => {  
   // load  Orders of shop
   this.http.get('https://giaohang.myshopify.com/admin/orders.json?limit='+this.ORDERS_PER_PAGE+'&order=created_at+desc&page='+pageno)
       
        .map(response => response.json().orders)
        .subscribe(data => {
                          
                          this.data = data;
                         
                          resolve(this.data);
                          }); 
      
    
     }); 
}

loadLineItemsByOrderId(orderId: number) {
  return new Promise(resolve => {
       
    this.http.get('https://giaohang.myshopify.com/admin/orders/'+orderId+'.json?fields=line_items')
      .map(res => res.json().order.line_items)
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
  });

}

countUnfulfilledOrders() {
  // return response;
       return new Promise(resolve => {
         this.http.get('https://giaohang.myshopify.com/admin/orders/count.json?fulfillment_status=null')
        .map(response => response.json().count)
        .subscribe(data => {
             resolve(data);
        }); 


       });
} 

getProductImage(productId: number) {
  // return response;
  return new Promise(resolve => {
    this.http.get('https://giaohang.myshopify.com/admin/products/'+productId+'.json?fields=image')
  .map(response => response.json().product.image.src)
  .subscribe(data => {
        resolve(data);   
  }, err => {
    resolve('http://via.placeholder.com/150x150');   
  }
); 


  });

}

getProductBarcode(productId: number) {
  // return response;
  return new Promise(resolve => {
    this.http.get('https://giaohang.myshopify.com/admin/products/'+productId+'.json?fields=variants')
  .map(response => response.json().product.variants[0].barcode)
  .subscribe(data => {
        resolve(data);
  }, err => {
    resolve('00000000');
}

); 


  });

}

// add tag for order ready to be pacekd
updateOrdersTag(orderId: number, tag: string) {
  let data = {
    "order": {
      "id": orderId,
      "tags": tag
    }
  };
  
  this.http.put('https://giaohang.myshopify.com/admin/orders/'+orderId+'.json', data)
  .map(respon => respon.json())
  .subscribe(res => {
      alert('Status of Order is saved!');
    }, err =>{alert(err);});
   
}


}
