declare var cordova:any;
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';

@Injectable()
export class HttpClient {
  constructor(private http : HTTP) {
  }

  public get(url: string) {
    return this.http.get(url, {}, {'Content-Type': 'application/json'}).then(res => {
      console.log('return:' + res);
      return JSON.parse(res.data)
    }).catch(err => {
      return err.error
    })
  }

  public post(url: string, body: any) {
    console.log('sendRequest');

    return this.http.post(url, body, {'Content-Type': 'application/json'}).then(res => {
      console.log('return:' + res);
      return JSON.parse(res.data)
    }).catch(err => {
      return err.error
    })
  }
}
