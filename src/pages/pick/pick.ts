import { Component, ViewChild } from '@angular/core';
import {AlertController, Content, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import {Product, ProductList} from '../../models/productList-model';
import { HomePage } from '../home/home';
import { PickingPage } from '../picking/picking';
// import { processRecords } from 'ionic-angular/components/virtual-scroll/virtual-util';


@IonicPage()
@Component({
  selector: 'page-pick',
  templateUrl: 'pick.html',
})
export class PickPage {
  @ViewChild(Content) content: Content;

  ordersToPick: Array<number>;
  ordersToPickName: Array<number>;
  // productsToPick: Array<number>;
  lineItems: any;
  // products: Array<number>;
  // tempProducts: Array<number>;
  uniqueProducts: Array<Product>;
  // imgSrcArr: Array<any>;

  product: Product;
  productList: ProductList;
  parsedProductList: ProductList;
  productArr: string;

  readyToPack: boolean;
  // key of each list item in firebase
  id: string;

  pickerName: string;
 
  constructor(private secureStorage: SecureStorage, private alertCtrl: AlertController, public platform: Platform, private camera: Camera, private barcodeScanner: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams, public orderService: OrderServiceProvider) {
    
    this.lineItems = null;
    this.readyToPack = false;
    
      
    this.ordersToPick = new Array<number>();
    this.ordersToPickName = new Array<number>();

    
            
    // load param from last page
    this.ordersToPick = navParams.get("ordersToPick");
    this.ordersToPickName = navParams.get("ordersToPickName");
    this.id = navParams.get("id");
    
    if( navParams.get("productList") !== '')
    {
      this.parsedProductList = JSON.parse(navParams.get("productList"));
      this.productList = new ProductList();
      this.parsedProductList.productArr.forEach(product =>{
        this.product = new Product(product.id, product.title, product.barcode, product.price, product.variant_title , product.quantity, product.origQuantity,product.imgSrc);
        this.productList.addProduct(this.product);
      });

    } else {
          
          this.productList = new ProductList();
          // push all line_items of orders into an array
          for(let orderId of this.ordersToPick) {
            
            this.orderService.loadLineItemsByOrderId(orderId).then(data => {
            
              this.lineItems = data;
              
                for(let lineItem of this.lineItems) {
                            
                  this.orderService.getProductImage(lineItem.product_id).then(data => {
                  
                  let variant_title = lineItem.variant_title==null?"":lineItem.variant_title.toString();
                  variant_title = variant_title==""?"":'('+variant_title+')';
                  let imgSrc = data.toString();
                
                    this.orderService.getProductBarcode(lineItem.product_id).then(data => {

                      let barcode = data.toString();
                      this.product = new Product(parseInt(lineItem.product_id), lineItem.title.toString(), barcode, lineItem.price, variant_title.toString() , parseInt(lineItem.quantity), parseInt(lineItem.quantity), imgSrc);
                      this.productList.addProduct(this.product);
                    
                    });

                
                  });
              
              }
              
            });
          }
    }

    
   this.getPickerName();
     
  }

  getPickerName() {
    this.secureStorage.create('tap2pick').then((storage: SecureStorageObject) => {
          
      storage.get('pickerName').then(
        pickerName => {
                     if(pickerName != '') {
                         this.pickerName = pickerName;
                       
                     }
        }
     )
   
    });
    
  }

  pickProduct(productId: number) {
      this.productList.pickProduct(productId);   
      this.readyToPack = this.productList.isReadyToPack();
   
  }

  pickProductByScan(barcode: string) {
    this.productList.pickProductByScan(barcode);   
    this.readyToPack = this.productList.isReadyToPack();
 
}

  pickAll(productId: number) {
      this.productList.pickAll(productId);   
      this.readyToPack = this.productList.isReadyToPack();
  }

  repick(productId: number) {
    this.productList.repick(productId);   
    this.readyToPack = this.productList.isReadyToPack();
  }

  scanBarcode() {
    this.barcodeScanner.scan({preferFrontCamera: false, showFlipCameraButton: true, showTorchButton: true, resultDisplayDuration: 0}).then((barcodeData) => {
      let productId = this.productList.pickProductByScan(barcodeData.text);
      this.scrollTo(productId.toString());
     }, (err) => {
         alert('Error');
     });
  }

  scrollTo(productId: string) {
    let yOffset = document.getElementById(productId).offsetTop;
    this.content.scrollTo(0, yOffset, 500);
  }

  savePickingOrders() {
    
    let alert = this.alertCtrl.create({
      title: 'Confirm save',
      message: 'Are you sure to save this pick list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.ordersToPick.forEach(orderId =>{
              this.orderService.updateOrdersTag(orderId, ""); 
             });
          }
        },
        {
          text: 'Save',
          handler: () => {
            if(this.id == '') {
              // save list to firebase
              let ordersId = '';
              let ordersName = '';
              this.ordersToPick.forEach(element => {
                ordersId += element.toString()+'#';
              });
              this.ordersToPickName.forEach(element => {
                ordersName += element.toString().replace('#','')+'#';
              });
             this.orderService.savePickingOrders(ordersId.substring(0,ordersId.length -1), ordersName.substring(0,ordersName.length -1),JSON.stringify(this.productList), this.pickerName);
           } else {
             this.orderService.updatePickingOrders(this.id, JSON.stringify(this.productList));
             
           }
            
            // redirect to Picking Page
            this.navCtrl.push(PickingPage);         
          }
        }
      ]
    });
    alert.present();

    

    
    
    

  }

  saveToPickedList() {

    let alert = this.alertCtrl.create({
      title: 'Confirm save',
      message: 'Are you sure to save this pick list into picked list?',
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
            // change status of pick list on firebase to "picked" on firebase
            this.orderService.updateStatusPickingOrders(this.id);

            // split orderslist in separat order and save on firebase
            this.orderService.addPackedOrders(this.ordersToPick, this.ordersToPickName, this.pickerName)

            // redirect to homepage
            this.navCtrl.setRoot(HomePage); 
          }
        }
      ]
    });
    alert.present();
   
   
  }


  takePicture(productId: number) {

    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
       saveToPhotoAlbum: false,
      allowEdit: false,
      quality: 80,
      targetWidth: 500,
      targetHeight: 500
  }).then((imgData) => {
    // imageData is a base64 encoded string
      let base64Image = "data:image/jpeg;base64," + imgData.replace(/(\r\n|\n|\r)/gm,"");
      this.productList.savePictureOfProduct(productId, base64Image);
      
  }, (err) => {
      alert(JSON.stringify(err));
  });

  }

  // getProductImage(productId: number) {
  //   var imgSrc = null;
  //   this.orderService.getProductImage(productId).then(data => {
  //     imgSrc = data;  
  //     return imgSrc;
  //   });

  // }
  
  // countProduct(product: any) {
  //   let counter = 0;
  //   this.tempProducts.forEach(element => {
  //     if(element == product) {
  //       counter ++;
  //     }
  //   });

  // }

  // pickProduct(product) {
  //   // remove product in tempProducts
  //   let idx = this.tempProducts.indexOf(product);
  //   if(idx > -1)
  //   this.tempProducts.splice(idx,1);

  // }

  // reset() {
  //   this.tempProducts = this.products;
  // }
  
  

}
