import {Injectable} from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastUtils {
  constructor(private toastCtrl: ToastController) {

  }

  showToast(msg: string, position: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  showToastWithCloseButton(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  showLongToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
