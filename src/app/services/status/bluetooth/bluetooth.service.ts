import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

// Plugins
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// Encoder para logo tickets
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  private connection!: Subscription;

  constructor(
    private bluetoothSerial: BluetoothSerial
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
            console.log('PromiseAll Devices', devices);
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
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        console.log('Dispositivo conectado?:', isConnected);
        resolve(isConnected);
      }, notConnected => {
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
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.write(resultByte).then(res => {
        console.log('Write Ticekt', res);
        resolve('BLUETOOTH: Su ticket se imprimio correctamente!.');
      }, error => {
        console.log('Fallo la impresion', error);
        reject('BLUETOOTH: Fallo la impresion, verifiquelo con su administrador.');
      })
    });
  }

  // Limpiar Buffer
  clearBuffer(){
    this.bluetoothSerial.clear();
  }
}