import {Component, ViewChild, ElementRef} from '@angular/core';
import { NavController} from 'ionic-angular';
import { UserService } from "../services/UserService";
import { UserEntity } from "../model/UserEntity";
import {UserModel} from "../model/UserModel";
import { LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { Media, MediaObject } from '@ionic-native/media';
import { VideoPlayer } from '@ionic-native/video-player';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastUtils } from '../utils/ToastUtils';
import { SocialSharing } from '@ionic-native/social-sharing';

import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';

import Chart from 'chart.js';

declare const AMap: any;
// declare var LocationPlugin;

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [UserService]
})
export class UserPage {
  server_url: string = "http://192.168.199.170:8080/api/";
  userList: Array<UserModel>;
  userRow: UserEntity;
  headerList :any;
  public path: any;
  profilePicture: any;
  public fileName: any;
  loginUser: string;
  latitude: any;
  longitude: any;
  @ViewChild('chartLine') chartLine: ElementRef;

  constructor(public navCtrl: NavController, private userService: UserService, public loadingCtrl: LoadingController,
              private media: Media, private videoPlayer: VideoPlayer, private barcodeScanner : BarcodeScanner,
              private toastUtils: ToastUtils, private socialSharing: SocialSharing, private transfer: FileTransfer,
              private file: File, private camera: Camera, private storage: Storage, private location: Geolocation) {
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

    this.storage.get("userName").then((value) => {
      if (value != null) {
        this.loginUser = value;
      }
    });
  }

  ionViewDidEnter() {
    this.loadCanvas();

    this.loadChart();

    this.loadedMap();
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

  choosePhoto() {
    const options = {
      quality: 50,
      sourceType:0,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.path = imageData;
      this.profilePicture = imageData;
      this.fileName = "test_img.jpg";
      //this.file.writeFile(this.file.dataDirectory, this.fileName, imageData);

      this.toastUtils.showToastWithCloseButton("imageData:" + imageData);
    }, (err) => {
      this.toastUtils.showToastWithCloseButton("picture error:" + err);
    })
  }

  chooseVideo() {
    const options = {
      quality: 100,
      sourceType:0,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.VIDEO
    }

    this.camera.getPicture(options).then((videoData) => {
      this.path = videoData;
      this.fileName = "test_video.mp4";
      //this.file.writeFile(this.file.dataDirectory, this.fileName, videoData);

      this.toastUtils.showToastWithCloseButton("videoData:" + videoData);
    }, (err) => {
      this.toastUtils.showToastWithCloseButton("video error:" + err);
    })
  }

  uploadFile() {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.fileName,
      headers: {}
    }

    fileTransfer.upload(this.path, this.server_url + "upload/multi", options).then((data) => {
      this.toastUtils.showToastWithCloseButton("Upload successfully!");
    }, (err) => {
      this.toastUtils.showToastWithCloseButton("Upload has error");
    })
  }

  downloadFile() {
    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.download(this.server_url + "download?name=" + this.fileName, this.path).then((entry) => {
      this.toastUtils.showToastWithCloseButton("Download successfully:" + entry.toURL());
    }, (error) => {
      this.toastUtils.showToastWithCloseButton("Download has error");
    })
  }

  loadedMap() {
    let map = new AMap.Map('map_container', {
      zoom: 11,
      resizeEnable: true
    });
    let autoComplete;
    let placeSearch;

    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Autocomplete','AMap.PlaceSearch'],
      function() {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.OverView({isOpen: true}));
        map.addControl(new AMap.MapType());

        var geoLocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          zoomToAccuracy: true,
          buttonPosition: 'LB',
          useNative: true
        });
        map.addControl(geoLocation);
        geoLocation.getCurrentPosition();

        AMap.event.addListener(geoLocation, "complete", function(e){
          alert("success:" + e.location_type + ",position:" + e.position);
        });

        AMap.event.addListener(geoLocation, "error", function(e){
          alert("errorLocation:" + e.info +",message:" + e.message);
        });

        autoComplete = new AMap.Autocomplete({ input:'autoInput'});

        placeSearch = new AMap.PlaceSearch({
          map: map
        });
        AMap.event.addListener(autoComplete, "select", function(e){
          placeSearch.search(e.poi.name);
        });
      });
  }

  getCurrentPosition() {
    // this.getUserLocation();

    this.location.getCurrentPosition().then((resp) => {
      alert('resp:'+ resp);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
      alert('Error getting location: '+ error);
    });
  }

  // getUserLocation(): Promise<any> {
  //   return new Promise<any>((resolve => {
  //     LocationPlugin.getLocation(data => {
  //       alert('data:'+ data);
  //       this.latitude = data.latitude;
  //       this.longitude = data.longitude;
  //     }, msg => {
  //       alert(msg.indexOf('缺少定位权限') == -1 ? ('错误消息：' + msg) : '缺少定位权限，请在手机设置中开启');
  //     });
  //   }))
  // }

  loadCanvas() {
    let canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
    let cxt = canvas.getContext("2d");
    cxt.fillStyle="#FF0000";
    cxt.beginPath();
    cxt.arc(70,18,15,0,Math.PI*2,true);
    cxt.closePath();
    cxt.fill();
  }

  loadChart() {
    Chart.Line(this.chartLine.nativeElement.getContext("2d"), {
      data: {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
          {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,59,90,81,56,55,40]
          },
          {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [28,48,40,19,96,27,100]
          }
        ]
      }
    })
  }
}
