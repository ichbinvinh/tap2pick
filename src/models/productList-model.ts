export class Product {

    public id: number
    public title: string;
    public barcode: string;
    public price: number;
    public variant_title: string;
    public quantity: number;
    public origQuantity: number;
    public imgSrc: string;
    public imgByPicker: string;
   
     
    constructor(id: number, title: string, barcode: string, price: number, variant_title: string, quantity: number, origQuantity: number ,imgSrc: string){
        this.id = id;
        this.title = title;
        this.barcode = barcode;
        this.price = price;
        this.variant_title = variant_title;
        this.quantity = quantity;
        this.origQuantity = origQuantity;
        this.imgSrc = imgSrc;
        this.imgByPicker = "";
        

    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    }

    getQuantity() {
        return this.quantity;
    }

    setImgByPicker(base64Image: string) {
        this.imgByPicker = base64Image;
    }
    
}

export class ProductList {

    productArr: Array<Product>;
    tempProductArr: Array<Product>;
    tempProduct: Product;
    productIdArr: Array<number>;

    public product_order: Array<any>;

    constructor() {
        this.productArr = new Array<Product>();
        this.tempProductArr = new Array<Product>();
        this.productIdArr = new Array<number>();

    }

    addProduct(product: Product) {
        this.tempProduct = new Product(product.id, product.title, product.barcode, product.price, product.variant_title, product.quantity, product.origQuantity, product.imgSrc);
        if(this.productArr.length == 0) {
            this.productArr.push(product);

            this.tempProductArr.push(this.tempProduct);
            
            this.productIdArr.push(product.id);

        } 
        else {
            let idx = this.productIdArr.indexOf(product.id);
            if(idx == -1) {
                this.productArr.push(product);

                this.tempProductArr.push(this.tempProduct);
                
                this.productIdArr.push(product.id);
            } else {
                this.productArr[idx].quantity += product.quantity;
                this.productArr[idx].origQuantity += product.quantity; 
                this.tempProductArr[idx].quantity += this.tempProduct.quantity;
            }
      
        }
       
                   
    }

    pickProduct(productId: number) {
        let idx = this.productIdArr.indexOf(productId);
       
            if(this.productArr[idx].id == productId && this.productArr[idx].quantity > 0) {
                this.productArr[idx].setQuantity((this.productArr[idx].quantity - 1));
            }
         

    }

    pickProductByScan(barcode: string) {
        for(let i=0; i< this.productArr.length; i++) {
            if(this.productArr[i].barcode == barcode  && this.productArr[i].quantity > 0) {
                this.productArr[i].setQuantity((this.productArr[i].quantity - 1));
                return this.productArr[i].id;
            }
        }
      
    }

    pickAll(productId: number) {
        let idx = this.productIdArr.indexOf(productId);
        this.productArr[idx].setQuantity(0);
    }

    repick(productId: number) {
        let idx = this.productIdArr.indexOf(productId);
        //this.productArr[idx].setQuantity(this.tempProductArr[idx].getQuantity());
        this.productArr[idx].setQuantity(this.productArr[idx].origQuantity);
    }

    savePictureOfProduct(productId: number, base64Image: string) {
        let idx = this.productIdArr.indexOf(productId);
        this.productArr[idx].setImgByPicker(base64Image);
        this.tempProductArr[idx].setImgByPicker(base64Image);
        
    }

    isReadyToPack() {
        let productToPick = 0;
        for(let product of this.productArr) {
            productToPick += product.quantity;
        }
        if(productToPick == 0)
            return true;
        else
            return false;    

    }



}