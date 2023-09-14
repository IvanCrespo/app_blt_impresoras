import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

// Plugins
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { PhotoLibrary } from '@awesome-cordova-plugins/photo-library/ngx';
import { CommandsArray, StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';

// Encoder para logo tickets
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  private connection!: Subscription;

  // StarPRNT
  imagenes: any = [];
  logo_uri: string = '';

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private photoLibrary: PhotoLibrary,
    private starprnt: StarPRNT,
  ) { }

  // Buscar dispositivos Bluetooth
  searchDevices(): Promise<Array<Object>> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then((success) => {
        const list = new Promise((resolve, reject) => {
          this.bluetoothSerial.list().then(response => {
            if (response.length > 0) {
              resolve(response);
            } else {
              reject('BLUETOOTH: No se encontraron dispositivos.');
            }
          }).catch((error) => {
            console.log(`BLUETOOTH Service 41 Error: ${JSON.stringify(error)}`);
            reject('BLUETOOTH: No se encuentra activado en este dispositivo.');
          });
        });
        const unpaired = new Promise((resolve, reject) => {
          this.bluetoothSerial.discoverUnpaired().then(response => {
            if (response.length > 0) {
              resolve(response);
            } else {
              reject('BLUETOOTH: No se encontraron dispositivos.');
            }
          }).catch((error) => {
            console.log(`BLUETOOTH Service 41 Error: ${JSON.stringify(error)}`);
            reject('BLUETOOTH: No se encuentra activado en este dispositivo.');
          });
        });
        return Promise.allSettled([list, unpaired])
          .then((devices: Array<Object>) => {
            resolve(devices);
          })
          .catch((error) => {
            console.log('Error PromiseAll Devices', error);
            reject('Error de información, verifique con el administrador');
          });
      }, error => {
        console.log(`BLUETOOTH Service 45 Error: ${JSON.stringify(error)}`);
        reject('BLUETOOTH: No se encuentra activado en este dispositivo.');
      });
    });
  }

  // Verificar si tenemos un dispositivo bluetooth conectado
  checkConnectedDevice() {
    return new Promise<string>((resolve, reject) => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        resolve(isConnected);
      }, notConnected => {
        console.log('Error Bluetooth Connect:', notConnected);
        reject('BLUETOOTH: No se encontro algún dispositivo conectado.');
      });
    });
  }

  // Conectar dispositivo
  connectDevice(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.connection = this.bluetoothSerial.connect(id).subscribe((subs) => {
        console.log('Hizo subs', subs);
        resolve('BLUETOOTH: Conexión exitosa.');
      }, fail => {
        console.log(`BLUETOOTH Service 88 Error conexión: ${JSON.stringify(fail)}`);
        reject('BLUETOOTH: Conexión invalida.');
      });
    });
  }

  // Desconectar dispositivo
  disconnectDevice(): Promise<boolean> {
    return new Promise((result) => {
      console.log('Resul', result);
      if (this.connection) {
        console.log('Si entro a desconectar');
        this.connection.unsubscribe();
      }
      result(true);
    });
  }

  // Imprimir Tickets
  writeTicket(resultByte: any) {
    return new Promise<string>((resolve, reject) => {
      this.bluetoothSerial.write(resultByte).then(res => {
        resolve('BLUETOOTH: Su ticket se imprimio correctamente!.');
      }, error => {
        console.log('Error Bluetooth Printer', error);
        reject('BLUETOOTH: Fallo la impresion, verifiquelo con su administrador.');
      })
    });
  }

  // Limpiar Buffer
  clearBuffer() {
    this.bluetoothSerial.clear();
  }

  /* ----------------------- Para StarPRNT ---------------------------- */
  async getLogoLibrary() {
    return await new Promise<boolean>((resolve, reject) => {
      this.photoLibrary.getLibrary().subscribe((result: any) => {
        let self = this;
        var library = result.library;
        library.forEach(function (libraryItem: any) {
          const result = libraryItem.fileName.substring(0, 4);
          let buscar = 'logo';
          if (buscar == result) {
            let datos: any = {};
            datos.nombre = libraryItem.fileName;
            datos.id = libraryItem.id;
            self.imagenes.push(datos);
          }
        });

        if (this.imagenes.length > 0) {
          let datos_img = this.imagenes[this.imagenes.length - 1];
          let imagen_uri = datos_img.id.split(';')[1];
          this.logo_uri = imagen_uri;
          resolve(true);
        }
        reject(false);
      });
    });
  }

  async convertImage(port: string, emulation: string) {
    return await new Promise<boolean>((resolve, reject) => {
      this.photoLibrary.requestAuthorization().then(async () => {
        const resLogo = await this.getLogoLibrary();
        if (resLogo) {
          let imageObj = {
            uri: 'file:///' + this.logo_uri,
            width: 384,
            cutReceipt: true,
            openCashDrawer: false
          }
          this.starprnt.printImage(port, emulation, imageObj).then(async result => {
            console.log('Entro a impresion logo', result);
            resolve(true);
          }).catch(async error => {
            console.log('Error logo', error);
            reject(false);
          });
        }
      }).catch(err => {
        return false;
      });
    });
  }

  async ticketQRPRNT(port: string, emulation: string, commands: CommandsArray) {
    return await new Promise<boolean>((resolve, reject) => {
      this.starprnt.print(port, emulation, commands).then(async result => {
        console.log('Entro a impresion QR', result);
        resolve(true);
      }).catch(async error => {
        console.log('Error QR', error);
        reject(false);
      });
    });
  }

  async ticketEjemploPRNT(port: string, emulation: string, commands: CommandsArray) {
    return await new Promise<boolean>((resolve, reject) => {
        this.starprnt.print(port, emulation, commands).then(async result => {
            console.log('Entro a impresion ticket', result);
            resolve(true);
        }).catch(async error => {
            console.log('Error ticket', error);
            reject(false);
        });
    });
}
}