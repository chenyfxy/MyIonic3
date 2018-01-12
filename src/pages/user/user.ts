import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { UserService } from "../services/UserService";
import { UserEntity } from "../model/UserEntity";
import {UserModel} from "../model/UserModel";
import { LoadingController } from 'ionic-angular';

import { Media, MediaObject } from '@ionic-native/media';
import { VideoPlayer } from '@ionic-native/video-player';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastUtils } from '../utils/ToastUtils';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [UserService]
})
export class UserPage {
  userList: Array<UserModel>;
  userRow: UserEntity;
  headerList :any;

  constructor(public navCtrl: NavController, private userService: UserService, public loadingCtrl: LoadingController,
              private media: Media, private videoPlayer: VideoPlayer, private barcodeScanner : BarcodeScanner,
              private toastUtils: ToastUtils, private socialSharing: SocialSharing) {
    this.presentLoading();

    this.headerList = ["User name", "Password", "User sex"];

   this.userService.getUserArray().subscribe(
     data => {
       this.userList = new Array<UserModel>(data.userList.length);

       for (var i = 0; i < data.userList.length; i++) {
         this.userRow = data.userList[i];

         this.userList[i] = new UserModel(this.userRow.id, this.userRow.userName, this.userRow.password, this.userRow.userSex, this.userRow.nickName,
           this.userRow.cellNumber, this.userRow.isSelected);
       }
     });

   this.playMedia();
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

  playMedia() {
    const file: MediaObject = this.media.create('file:///android_asset/www/assets/media/test_2.mp3');

    // file.onStatusUpdate.subscribe(status => console.log(status));
    // file.onSuccess.subscribe(() => console.log('Action is successful'));
    // file.onError.subscribe(error => console.log('Error!', error));
console.log("file:", file);
file.seekTo(0);

    file.play();

    // file.pause();

    file.getCurrentPosition().then((position) => {
      console.log(position);
    })

    let duration = file.getDuration();
    console.log(duration);

    // file.seekTo(10000);

    // file.stop();

    // file.release();
  }

  playVideo() {
    this.videoPlayer.play('file:///android_asset/www/assets/media/test.mp4').then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log('err:', err);
    })
  }

  barcodeSc() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.toastUtils.showToastWithCloseButton(barcodeData.text);
    }, err =>{
      console.log("barcodeErr:", err);
    })
  }

  sharing() {
    this.socialSharing.share("Test").then(() => {

    }).catch(() => {});
  }
}
