import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import {Product, ProductList} from '../../models/productList-model';


@IonicPage()
@Component({
  selector: 'page-pack',
  templateUrl: 'pack.html',
})
export class PackPage {

 
  lineItems: any;
  product: Product;
  productList: ProductList;


  pickedOrder_orderId: number;
  pickedOrder_orderName: string;

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public orderService: OrderServiceProvider) {
  
    this.lineItems = null;
        
    // load param from last page
    this.pickedOrder_orderId = navParams.get("pickedOrder_orderId");
    this.pickedOrder_orderName = navParams.get("pickedOrder_orderName");
   
    this.productList = new ProductList();
    // push all line_items of orders into an array
        
      this.orderService.loadLineItemsByOrderId(this.pickedOrder_orderId).then(data => {
      
        this.lineItems = data;
        
          for(let lineItem of this.lineItems) {
                      
            this.orderService.getProductImage(lineItem.product_id).then(data => {
            
            let variant_title = lineItem.variant_title==null?"":lineItem.variant_title.toString();
            variant_title = variant_title==""?"":'('+variant_title+')';
            let imgSrc = data.toString();
          
            let barcode = '';
                this.product = new Product(parseInt(lineItem.product_id), lineItem.title.toString(), barcode, lineItem.price, variant_title.toString() , parseInt(lineItem.quantity), parseInt(lineItem.quantity), imgSrc);
                this.productList.addProduct(this.product);
          
            });
     
        }
        
      });
        
}

tagAsPacked() {
  
  let alert = this.alertCtrl.create({
    title: 'Tag as packed',
    message: 'Are you sure to add a tag Packed to this order on shopify?',
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
          
          this.orderService.updateOrdersTag(this.pickedOrder_orderId, 'tap2pick-packed');
         
        }
      }
    ]
  });
  alert.present();
}

}
