import { Component } from '@angular/core';
import {IonicPage, NavParams , NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Http} from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading: Loading;
  registerCredentials = {email: '', password: ''};
  placeHolder = {username: 'Email', password: 'Password'};
  myhttp: any;
  pickerName: string;
  
  constructor(private secureStorage: SecureStorage, public navParams: NavParams, public _myhttp: Http, private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
     this.init();
  }

  init() {
    // create secure storage
   this.secureStorage.create('tap2pick').then((storage: SecureStorageObject) => {

      storage.get('rememberMe').then (
        value => {
                  if(value == 'true') {
                    storage.get('pickerName').then(
                         pickerName => {
                                      if(pickerName != '') {
                                          this.nav.push(TabsPage);
                                      }
                         }
                      )
  
                  }
        }
      )

    });


  }

  public login() {
    
    this.showLoading();
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      
      if (allowed) {
        setTimeout(() => {
        this.loading.dismiss();
        this.secureStorage.create('tap2pick').then((storage: SecureStorageObject) => {
          
          storage.set('rememberMe', 'true');
          storage.set('pickerName', this.pickerName);
          this.nav.push(TabsPage);
       
        },error => alert(error +'. You can enable screen lock for your phone to continue.'));
        
        });
      } else {
        this.showError("Access denied");
      }
    },
    error => {
      this.showError(error);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}

