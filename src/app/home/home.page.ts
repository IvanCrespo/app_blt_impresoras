import { Component, OnInit } from '@angular/core';
import EscPosEncoder from 'esc-pos-encoder-ionic';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  printSeleccionada: string = '';
  impresoras: any;
  dataSend: string = '';

  constructor(
    private bluetoothSerial: BluetoothSerial
  ) { }

  ngOnInit(): void {
    this.checkBluetoothEnabled();
  }

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(res => {
      console.log('Respuesta de enabled', res);
      this.listDevices();
    }).catch((e) => {
      console.log('Error del Blt', e);
    });
  }

  listDevices() {
    console.log("LIST DEVICES");
    this.bluetoothSerial.list().then((devices) => {
      console.log('Impresoras existentes', devices);
      this.impresoras = devices;
    }).catch((e) => {
      console.error('Sin impresoras', e);
    });
  }

  selectDevice() {
    console.log(this.printSeleccionada);
    let connectedDevice = this.printSeleccionada;
    if (!connectedDevice) {
      console.log('Que impresora ocuparemos????');
    }
    this.connect(connectedDevice);
  }

  connect(address: any) {
    this.bluetoothSerial.connect(address).subscribe(res => {
      console.log('Success impresora connect', res);
      this.deviceConnected();
    }, error => {
      console.log('Error al realizar la conexion por Blt', error);
    })
  }

  deviceConnected() {
    console.log('Entro aqui');
    this.bluetoothSerial.subscribe('\n').subscribe((data) => {
      console.log(data);
    });
  }

  imprimirTicket() {
    /* const encoder = new EscPosEncoder();
    const result = encoder.initialize();

    result
      .codepage('windows1250')
      .align('center')
      .newline()
      .line('Congratulation, print success')
      .line('Bluetooth MAC :')
      .line('Bluetooth MAC : ' + this.deviceConnected)
      .newline()
      .newline()
      .align('left')
      .qrcode('https://maliured.hr')
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    const resultByte = result.encode();
    this.bluetoothSerial.write(resultByte)
      .then(() => {
        console.log('Print success');
      })
      .catch((err) => {
        console.error(err);
      }); */
    let encoder = new EscPosEncoder();
    let img = new Image();
    let resultByte = null;
    img.src = '../../assets/logo.png'
    const result = encoder.initialize();
    img.onload = () => {
      result
        .image(img, 312, 312, 'atkinson')
      resultByte = result.encode();
      // Rest of printing process (Bluetooth Serial in your case)
      this.bluetoothSerial.write(resultByte).then(res => {
        console.log('Success al imprimir', res);
      }, error => {
        console.log('Fallo la impresion', error);
      })
    }
    /* this.dataSend = '\n'; */
  }
}
