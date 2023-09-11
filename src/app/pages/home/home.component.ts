import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

// Components
import { PrintTicketsComponent } from 'src/app/components/modals/print-tickets/print-tickets.component';

// Services 
import { BluetoothService } from 'src/app/services/status/bluetooth/bluetooth.service';

// Exports
import { serviceExport } from 'src/app/shared/exports/serviceExport';

// Helpers
import { orderDevices } from 'src/app/shared/helpers/orderDevices';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  lists: Array<any> = [];
  unpaireds: Array<any> = [];
  loaded: boolean = false;
  error: boolean = false;
  verificado: boolean = true;
  active: any = {};
  device: string = "";
  address: string = "";

  constructor(
    private bltService: BluetoothService,
    private serviceExport: serviceExport,
    private platform: Platform,
    private mdlCtrl: ModalController
  ) { }

  ngOnInit() {
    this.platform.ready().then(async () => {
      this.checkConnection();
      this.searchDevices();
    });
  }

  searchDevices() {
    this.bltService.searchDevices().then((devices: Array<Object>) => {
      console.log('Devices encontrados Home', devices);
      devices.forEach(async (deviceList: any, index) => {
        if (index == 0 && deviceList.status == 'fulfilled') {
          const res: any = await orderDevices(deviceList.value);
          this.lists = res;
          /* this.lists = [...deviceList.value]; */
        }
        if (index == 1 && deviceList.status == 'fulfilled') {
          const res: any = await orderDevices(deviceList.value);
          this.unpaireds = res;
        }
      });
      if (this.lists.length > 0 || this.unpaireds.length > 0) {
        this.loaded = true;
        this.error = false;
      } else {
        this.loaded = false;
        this.error = true;
        this.serviceExport.toastMsg('No se ha encontrado ningún dispositivo!', 'warning', 2500);
      }
    }).catch((error) => {
      console.log(error);
      this.loaded = false;
      this.error = false;
      this.serviceExport.toastMsg('Error al buscar dispositivos, verifiquelo con el administrador!', 'danger', 2500);
    });
  }

  handleRefresh(event: any) {
    this.loaded = false;
    setTimeout(() => {
      this.checkConnection();
      this.searchDevices();
      event.target.complete();
    }, 2000);
  }

  async selectDevice(device: any, lista: any) {
    const { id, name } = device;
    if (Object.entries(this.active).length > 0 && this.active.id !== id) {
      let alerta = await this.serviceExport.singleAlert('Precaución Dispositivo', `Actualmente el dispositivo ${this.active.name !== undefined ? this.active.name : "Device Desconocido"} esta sincronizado, para continuar debera de desconectarlo`, 'OK!');
      await alerta.present();
      return;
    }
    if (this.active.id == id) {
      let alerta = await this.serviceExport.dataAlert('Precaución Dispositivo', `Este dispositivo: ${name !== undefined ? name : "Device Desconocido"} esta sincronizado, seguro que quiere desconectarlo?`, 'Cancelar', 'Confirmar');
      await alerta.present();
      await alerta.onDidDismiss().then(async ({ data }) => {
        if (data) {
          let loading = await this.serviceExport.loading('Desconectando...');
          await loading.present();
          this.bltService.disconnectDevice().then(async success => {
            console.log('Si se cerro', success);
            this.device = "";
            this.address = "";
            localStorage.setItem('device', JSON.stringify(''));
            this.active = {};
            await loading.dismiss();
            this.serviceExport.toastMsg('Dispositivo desconectado!', 'success', 2500);
          }, async fail => {
            await loading.dismiss();
            this.serviceExport.toastMsg('No se pudo realizar dicha petición, verifiquelo con el administrador!', 'warning', 2500);
          });
        }
      })
      return;
    } else {
      let alerta = await this.serviceExport.dataAlert('Elegir Dispositivo', `Desea conectarse a ${name !== undefined ? name : "Device Desconocido"} con ID: ${id}?`, 'Cancelar', 'Confirmar');
      await alerta.present();
      await alerta.onDidDismiss().then(async ({ data }) => {
        if (data) {
          let loading = await this.serviceExport.loading('Conectando...');
          await loading.present();
          this.bltService.connectDevice(id).then(async success => {
            this.device = name;
            this.address = id;
            localStorage.setItem('device', JSON.stringify(device));
            this.active = lista.find((device: any) => device.id === id);
            console.log('Activo', this.active);
            /* this.active = (Object.keys(found).length > 0) ? true : false; */
            await loading.dismiss();
            this.verificado = false;
            this.serviceExport.toastMsg('Dispositivo sincronizado!', 'success', 2500);
          }, async fail => {
            this.device = "";
            this.address = "";
            this.active = {};
            await loading.dismiss();
            this.verificado = true;
            this.serviceExport.toastMsg('Se ha perdido la conexión!', 'warning', 2500);
          });
        }
      })
    }
  }

  checkConnection() {
    this.bltService.checkConnectedDevice().then(async (isConnected) => {
      console.log('Conectado entro?: ', isConnected);
      if (isConnected == "OK") {
        let device = JSON.parse(localStorage.getItem('device') || '');
        this.device = device.name;
        this.address = device.address;
        this.active = device;
        this.verificado = false;
        this.serviceExport.toastMsg('Dispositivo conectado!', 'success', 2500);
      }
    }, async (notConnected) => {
      console.log('No hay conectado', notConnected);
      this.active = {};
      this.verificado = true;
      this.serviceExport.toastMsg('No se cuenta con dispositivo conectado!', 'warning', 2500);
    });
  }

  async openMdlTickets() {
    const modal = await this.mdlCtrl.create({
      component: PrintTicketsComponent,
      componentProps: {
        'device': this.active
      }
    });
    modal.onDidDismiss().then((modelData) => {
      console.log(modelData);
    });
    return await modal.present();
  }
}
