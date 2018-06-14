import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable'


@Injectable()
export class AuthServiceProvider {

  
  public login(credentials) {


    if(credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to  backend to make a real check!
        var access = false;
        if(credentials.email === "M" && credentials.password === "m") {
          access = true;
        }
        
        observer.next(access);
        observer.complete();
      });
    }
  }

}
