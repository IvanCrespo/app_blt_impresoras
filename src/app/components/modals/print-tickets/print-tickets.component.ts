import { Component, Input, OnInit } from '@angular/core';

// Services 
import { BluetoothService } from 'src/app/services/status/bluetooth/bluetooth.service';
import { CommandsArray, StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';

// Exports
import { serviceExport } from 'src/app/shared/exports/serviceExport';

// Tickets
import { Tickets } from 'src/app/shared/tickets/tickets';

@Component({
  selector: 'app-print-tickets',
  templateUrl: './print-tickets.component.html',
  styleUrls: ['./print-tickets.component.scss'],
})
export class PrintTicketsComponent implements OnInit {

  @Input() device: any;
  tamanio_papel: string = "";
  activate: boolean = false;
  port: string = '';
  emulation: string = '';

  constructor(
    private bltService: BluetoothService,
    private serviceExport: serviceExport,
    private tickets: Tickets
  ) { }

  ngOnInit() {
    this.conocerImpresora();
  }

  conocerImpresora() {
    if (Object.entries(this.device).length > 0) {
      let termino = "STAR";
      let posicion = this.device.name.toLowerCase().indexOf(termino.toLowerCase());
      if (posicion !== -1) {
        this.activate = true;
        let emulation = this.device.name.split(' ')[1].split('-')[0];
        if (emulation == 'L200') {
          this.emulation = 'StarPRNT';
          this.port = `BT:${this.device.id}`;
        }
        else if (emulation == 'S230I') {
          this.emulation = 'EscPosMobile';
          this.port = `BT:${this.device.id}`;
        };
      }
    }
  }

  async printLogo() {
    this.bltService.clearBuffer();
    let loading = await this.serviceExport.loading('Imprimiendo Logo...');
    await loading.present();
    this.bltService.checkConnectedDevice().then(async (isConnected: string) => {
      if (isConnected == "OK") {
        let isLogo = await this.tickets.ticketLogo();
        this.bltService.writeTicket(isLogo).then(async (writeTicket: string) => {
          // Success Impresion
          this.serviceExport.toastMsg(writeTicket, 'success', 2500);
        }, async (notWriteTicket: string) => {
          // Error Impresion
          this.serviceExport.toastMsg(notWriteTicket, 'danger', 2500);
        }).finally(async () => {
          await loading.dismiss();
        });
      }
      await loading.dismiss();
    }, async (notConnected: string) => {
      // Error Conexion
      this.serviceExport.toastMsg(notConnected, 'danger', 2500);
    }).finally(async () => {
      await loading.dismiss();
    });
  }

  async printQR() {
    this.bltService.clearBuffer();
    let loading = await this.serviceExport.loading('Imprimiendo QR...');
    await loading.present();
    this.bltService.checkConnectedDevice().then(async (isConnected: string) => {
      if (isConnected == "OK") {
        let result = await this.tickets.ticketQR('Hola! a Todos');
        this.bltService.writeTicket(result).then(async (writeTicket: string) => {
          // Success Impresion
          this.serviceExport.toastMsg(writeTicket, 'success', 2500);
        }, async (notWriteTicket: string) => {
          // Error Impresion
          this.serviceExport.toastMsg(notWriteTicket, 'danger', 2500);
        }).finally(async () => {
          await loading.dismiss();
        });
      }
      await loading.dismiss();
    }, async (notConnected: string) => {
      // Error Conexion
      this.serviceExport.toastMsg(notConnected, 'danger', 2500);
    }).finally(async () => {
      await loading.dismiss();
    });
  }

  async ticketEjemplo() {
    let data = {
      folio: 'ABC12345',
      fecha: '11 de Septiembre del 2022, 11:13 AM',
      tarjeta: '0080',
      costo: 200,
      supervisor: 'Ivan Crespo Reyes',
    }
    this.bltService.clearBuffer();
    this.printLogo();
    setTimeout(async () => {
      this.bltService.clearBuffer();
      let loading = await this.serviceExport.loading('Imprimiendo Ticket...');
      await loading.present();
      this.bltService.checkConnectedDevice().then(async (isConnected: string) => {
        if (isConnected == "OK") {
          let result = await this.tickets.ticketVentaActivacion(data);
          this.bltService.writeTicket(result).then(async (writeTicket: string) => {
            // Success Impresion
            this.serviceExport.toastMsg(writeTicket, 'success', 2500);
          }, async (notWriteTicket: string) => {
            // Error Impresion
            this.serviceExport.toastMsg(notWriteTicket, 'danger', 2500);
          }).finally(async () => {
            await loading.dismiss();
          });
        }
        await loading.dismiss();
      }, async (notConnected: string) => {
        // Error Conexion
        this.serviceExport.toastMsg(notConnected, 'danger', 2500);
      }).finally(async () => {
        await loading.dismiss();
      });
    }, 1800);
  }

  async printLogoPRNT() {
    let loading = await this.serviceExport.loading('Imprimiendo Logo...');
    await loading.present();
    const res = await this.bltService.convertImage(this.port, this.emulation);
    if (res) {
      this.serviceExport.toastMsg('BLUETOOTH: Su ticket se imprimio correctamente!.', 'success', 2500);
    } else {
      this.serviceExport.toastMsg('BLUETOOTH: Fallo la impresion, verifiquelo con su administrador.', 'danger', 2500);
    }
    await loading.dismiss();
  }

  async printQRPRNT() {
    let loading = await this.serviceExport.loading('Imprimiendo QR...');
    await loading.present();
    let commands: CommandsArray = this.tickets.qrPRNT();
    const res = await this.bltService.ticketQRPRNT(this.port, this.emulation, commands);
    if (res) {
      this.serviceExport.toastMsg('BLUETOOTH: Su ticket se imprimio correctamente!.', 'success', 2500);
    } else {
      this.serviceExport.toastMsg('BLUETOOTH: Fallo la impresion, verifiquelo con su administrador.', 'danger', 2500);
    }
    await loading.dismiss();
  }

  async ticketEjemploPRNT() {
    let todoTicket: boolean[] = [];
    let loading = await this.serviceExport.loading('Imprimiendo Ticket...');
    await loading.present();
    let commands: CommandsArray = this.tickets.ticketPRNT();
    let commandsQR: CommandsArray = this.tickets.qrPRNT();
    const resLogo = await this.bltService.convertImage(this.port, this.emulation);
    const resTicket = await this.bltService.ticketEjemploPRNT(this.port, this.emulation, commands);
    const resQR = await this.bltService.ticketQRPRNT(this.port, this.emulation, commandsQR);
    todoTicket.push(resLogo, resTicket, resQR);
    if (todoTicket.indexOf(false) === 0) {
      this.serviceExport.toastMsg('BLUETOOTH: Fallo la impresion, verifiquelo con su administrador.', 'danger', 2500);
    } else {
      this.serviceExport.toastMsg('BLUETOOTH: Su ticket se imprimio correctamente!.', 'success', 2500);
    }
    await loading.dismiss();
  }
}