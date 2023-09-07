import { Injectable } from "@angular/core";
import { ToastController, LoadingController, AlertController } from "@ionic/angular";

@Injectable({
    providedIn: "root"
})

export class serviceExport {

    constructor(
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController
    ) { }

    /* Mensaje Toast */
    async toastMsg(message: string, color: string, duration: number) {
        const toast = await this.toastCtrl.create({
            message,
            color,
            duration,
            position: 'top',
            mode: 'ios',
            animated: true
        });
        toast.present();
    }

    /* Loading */
    async loading(message: string) {
        let loading = await this.loadingCtrl.create({
            message,
            mode: 'ios',
            translucent: true,
            backdropDismiss: false,
        });
        return loading;
    }

    /* Single Alert */
    async singleAlert(header: string, message: string, txtBtn: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            mode: 'ios',
            translucent: true,
            backdropDismiss: false,
            cssClass: 'singleAlert',
            buttons: [
                {
                    text:txtBtn,
                    handler: () => {
                        alert.dismiss(true);
                        return false;
                    }
                }
            ],
        });
        return alert;
    }


    /* Data Alert */
    async dataAlert(header: string, message: string, txtBtn: string, txtSecondBtn: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            mode: 'ios',
            translucent: true,
            backdropDismiss: false,
            cssClass: 'dataAlert',
            buttons: [
                {
                    text:txtBtn,
                    handler: () => {
                        alert.dismiss(false);
                        return false;
                    }
                },
                {
                    text:txtSecondBtn,
                    handler: () => {
                        alert.dismiss(true);
                        return true;
                    }
                }
            ],
        });
        return alert;
    }
}