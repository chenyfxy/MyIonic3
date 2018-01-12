import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AjaxResponseBody} from "../model/AjaxResponseBody";

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {
  }

  public get(url: string) {
    console.log("url:", url);
    return this.http.get(url).subscribe(
      data => {data},
      err => {});
  }

  public post(url: string, body: any) {
    return this.http.post(url, body, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  public login(url: string, body: any) {
    return this.http.post<AjaxResponseBody>(url, body, {headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }
}
