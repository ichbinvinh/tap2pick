import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {AngularFireModule} from 'angularfire2';
import { AngularFireDatabaseModule } from "angularfire2/database";
//import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';


import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpClientProvider } from '../providers/http-client/http-client';
import { OrderServiceProvider } from '../providers/order-service/order-service';
import { LoginPage } from '../pages/login/login';
import { PickPage } from '../pages/pick/pick';
import { ProductServiceProvider } from '../providers/product-service/product-service';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { PickingPage } from '../pages/picking/picking';
import { SecureStorage } from '@ionic-native/secure-storage';
import { PickedPage } from '../pages/picked/picked';
import { PackPage } from '../pages/pack/pack';
import {ShipPage} from '../pages/ship/ship';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    PickPage,
    PickingPage,
    PackPage,
    PickedPage,
    ShipPage
  ],
  imports: [
    HttpClientModule,
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    PickPage,
    PickingPage,
    PackPage,
    PickedPage,
    ShipPage
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    HttpClientProvider,
    OrderServiceProvider,
    ProductServiceProvider,
    BarcodeScanner,
    Camera,
    SecureStorage
  ]
})
export class AppModule {}
