import {Injectable} from "@angular/core";
import {UserEntity} from "../model/UserEntity";
import {HttpClient} from "@angular/common/http";
import {UserList} from "../model/UserList";

@Injectable()
export class UserService {
  private url: string = "http://192.168.199.170:8080/getUserAndNodeList";

  constructor(private http: HttpClient) {

  }

  getUserArray() {
    return this.http.get<UserList>(this.url);
  }
}
