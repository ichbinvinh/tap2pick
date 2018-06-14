import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import {Product, ProductList} from '../../models/productList-model';
import {ShipPage} from '../ship/ship';


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
  shippingAddress: any;
  weight: 0;
  nullWeightItems: number;

  constructor(public modalCtrl: ModalController, 
              public alertCtrl: AlertController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public orderService: OrderServiceProvider) {
  
    this.lineItems = null;
    this.shippingAddress = null;
    this.nullWeightItems = 0;
        
    // load param from last page
    this.pickedOrder_orderId = navParams.get("pickedOrder_orderId");
    this.pickedOrder_orderName = navParams.get("pickedOrder_orderName");
   
    this.productList = new ProductList();
    // push all line_items of orders into an array
        
      this.orderService.loadLineItemsByOrderId(this.pickedOrder_orderId).then(data => {
      
        this.lineItems = data;
        
          for(let lineItem of this.lineItems) {

            this.shipment.weight += parseInt(lineItem.quantity) * parseFloat(lineItem.grams);
            if(parseInt(lineItem.grams) == 0) {
              this.nullWeightItems++;
            }
                      
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

     // load shipping_address
     this.orderService.loadShippingAddressByOrderId(this.pickedOrder_orderId).then(data => {
        this.shippingAddress = data;
        this.shipment.firstname = this.shippingAddress.first_name;
        this.shipment.lastname = this.shippingAddress.last_name;
        this.shipment.street = this.shippingAddress.address1;
        this.shipment.streetno = this.shipment.street.split(' ')[(this.shipment.street.split(' ').length-1)];
        this.shipment.street = this.shipment.street.replace(this.shipment.streetno,'');
        this.shipment.city = this.shippingAddress.city;
        this.shipment.plz = this.shippingAddress.zip;
        this.shipment.country = this.shippingAddress.country;
        this.shipment.telephone = this.shippingAddress.phone;
        this.shipment.description = '#'+ this.pickedOrder_orderName;
               
    
     }); 
        
}

openShipModal() {
  let myModal = this.modalCtrl.create(ShipPage, {'shipment': this.shipment, 'nullWeightItems': this.nullWeightItems.toString()});
  myModal.present();
}

// tagAsPacked() {
  
//   let alert = this.alertCtrl.create({
//     title: 'Tag as packed',
//     message: 'Are you sure to add a tag Packed to this order on shopify?',
//     buttons: [
//       {
//         text: 'Cancel',
//         role: 'cancel',
//         handler: () => {
          
//         }
//       },
//       {
//         text: 'Ok',
//         handler: () => {
          
//           this.orderService.updateOrdersTag(this.pickedOrder_orderId, 'tap2pick-packed');
         
//         }
//       }
//     ]
//   });
//   alert.present();
// }

}
