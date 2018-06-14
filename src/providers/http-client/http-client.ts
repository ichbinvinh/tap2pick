import { Http,  Headers } from '@angular/http';
import { Injectable } from '@angular/core';


@Injectable()
export class HttpClientProvider {

  constructor(public http: Http) {

  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' + btoa('8bddbf713050b5e65d59ad6ec36e41c7:e8f557e242f24f3e6f305e495d951517'));
    headers.append('Access-Control-Allow-Origin', '*' );
    headers.append('Content-Type', 'application/json');
  }

  createAuthorizationShipCloudHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' + btoa('e405b08abad70f9768678065bbe1e943:asiasale@123'));
    headers.append('Access-Control-Allow-Origin', '*' );
    headers.append('Content-Type', 'application/json');
  }

  get(url) {
    console.log(url);
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {headers: headers});
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  put(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.put(url, data, {headers: headers});
  }

  // delete(url) {
  //   let headers = new HttpHeaders();
  //   this.createAuthorizationHeader(headers);
  //   return this.http.delete(url, {
  //     headers: headers
  //   });
  // }

  postShipCloud(url, data) {
    let headers = new Headers();
    this.createAuthorizationShipCloudHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  getShipCloud(url) {
     let headers = new Headers();
    this.createAuthorizationShipCloudHeader(headers);
    return this.http.get(url, {headers: headers});
  }

}
