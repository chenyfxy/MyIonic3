import { LoadingController } from 'ionic-angular';
import {Injectable} from "@angular/core";

declare let Wechat;

@Injectable()
export class ShareService {
  constructor(private loadingCtrl: LoadingController) {

  }

  wechatLogin() {
    var allowedLogin = false;

    Wechat.isInstalled(function (installed) {
      alert("Wechat installed: " + (installed ? "Yes" : "No"));
      allowedLogin = true;
    }, function (reason) {
      alert("Failed: " + reason);
    });

    if (allowedLogin) {
      let scope = "snsapi_userinfo", state = "_" + (+new Date());

      Wechat.auth(scope, state, function(response){
        alert("response:" + JSON.stringify(response));
      }, function(reason) {
        alert("Failed: " + reason);
      });
    }
  }
}
