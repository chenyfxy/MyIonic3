import 'rxjs';
import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { HttpService } from "../services/HttpService";
import { Storage } from '@ionic/storage';
import { ToastUtils } from '../utils/ToastUtils';
import { UserPage } from '../user/user';

import { TranslateService } from '@ngx-translate/core';

import { QQSDK, QQShareOptions } from '@ionic-native/qqsdk';

import { ShareService } from '../services/ShareService';

import { Dialogs } from '@ionic-native/dialogs';

import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService, ToastUtils, ShareService]
})
export class HomePage implements OnInit {
  public loginForm : FormGroup;
  userName : any;
  password : any;
  nameValue : any;
  psValue : any;
  checkedName : any;
  checkedPas : any;
  pwshow: boolean = false;

  // first run
  constructor(public navCtrl: NavController, public storage: Storage,
              private formBuilder: FormBuilder, private httpService: HttpService, private toastUtils : ToastUtils,
              private translate: TranslateService, private qq: QQSDK, private shareService: ShareService, private dialogs: Dialogs) {
    this.setDefaultValues();

    this.translate.addLangs(['zh-CN', 'en']);

    let broswerLang = this.translate.getBrowserLang();
    this.translate.use(broswerLang.match(/en|zh-CN/) ? broswerLang : 'zh-CN');

    this.dialogs.alert('Hello world');
  }

  // second run
  ngOnInit() : void {
    this.initFormGroup();
  }

  setDefaultValues() {
    this.storage.get("userName").then((value) => {
      if (value != null) {
        this.nameValue = value;
        this.checkedName = true;
        console.log("newValue0:" + this.nameValue);

        this.initFormGroup();
      }
    });

    this.storage.get("password").then((value) => {
      if (value != null) {
        this.psValue = value;
        this.checkedPas = true;

        this.initFormGroup();
      }
    });
  }

  initFormGroup() {
    console.log("nameValue:", this.nameValue);
    this.loginForm = this.formBuilder.group({
      userName: [this.nameValue, Validators.compose([Validators.minLength(4), Validators.required])],
      password: [this.psValue, Validators.compose([Validators.required, Validators.minLength(4)])],
      checkedName:[this.checkedName],
      checkedPas:[this.checkedPas]
    });
    this.userName = this.loginForm.controls["userName"];
    this.password = this.loginForm.controls["password"];
  }

  loginClick(_event) {
    _event.preventDefault();
    console.log("loginValue:" + JSON.stringify(this.loginForm.value));

    if (this.loginForm.value.checkedName) {
      this.storage.set("userName", this.loginForm.value.userName);
    }

    if (this.loginForm.value.checkedPas) {
      this.storage.set("password", this.loginForm.value.password);
    }

    this.httpService.login('http://192.168.199.170:8080/login/', JSON.stringify(this.loginForm.value)).subscribe(
      data => {
        this.toastUtils.showToast(data.msg, 'top');

        if (data.result != null) {
          this.navCtrl.push(UserPage);
        }
      }
    )
  };

  qqLogin() {
    const clientOptions: QQShareOptions = {
      client: this.qq.ClientType.QQ
    };

    this.qq.checkClientInstalled(clientOptions).then(result => {
      alert('client is installed');
    }).catch(err => {
      alert('client is not installed:' + err);
    })

    this.qq.ssoLogin(clientOptions).then(result => {
      alert('token is ' + result.access_token);
      alert('userid is ' + result.userid);
      alert('expires_time is ' + new Date(parseInt(result.expires_time)) + ' TimeStamp is ' + result.expires_time);
    }).catch(error => {
      alert(error); // Failed
    });
  }

  wechatLogin() {
    this.shareService.wechatLogin();
  }
}
