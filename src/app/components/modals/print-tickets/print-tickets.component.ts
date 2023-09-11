import { Component, Input, OnInit } from '@angular/core';

// Services 
import { BluetoothService } from 'src/app/services/status/bluetooth/bluetooth.service';

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
      }
    }
  }

  async printLogo() {
    this.bltService.clearBuffer();
    this.bltService.checkConnectedDevice().then(async (isConnected) => {
      if (isConnected == "OK") {
        let isLogo = await this.tickets.ticketLogo();
        this.bltService.writeTicket(isLogo).then(async (writeTicket) => {
          console.log('Se imprimio?: ', writeTicket);
        }, async (notWriteTicket) => {
          console.log('No se imprimio', notWriteTicket);
        });
      }
    }, async (notConnected) => {
      console.log('No hay conectado', notConnected);
      this.serviceExport.toastMsg('No se cuenta con dispositivo conectado!', 'warning', 2500);
    });
  }

  async printQR() {
    this.bltService.clearBuffer();
    this.bltService.checkConnectedDevice().then(async (isConnected) => {
      if (isConnected == "OK") {
        let result = await this.tickets.ticketQR('Hola! a Todos');
        this.bltService.writeTicket(result).then(async (writeTicket) => {
          console.log('Se imprimio?: ', writeTicket);
        }, async (notWriteTicket) => {
          console.log('No se imprimio', notWriteTicket);
        });
      }
    }, async (notConnected) => {
      console.log('No hay conectado', notConnected);
      this.serviceExport.toastMsg('No se cuenta con dispositivo conectado!', 'warning', 2500);
    });
  }

  ticketEjemplo() {
    let data = {
      folio: 'ABC12345',
      fecha: '11 de Septiembre del 2022, 11:13 AM',
      tarjeta: '0080',
      costo: 200,
      supervisor: 'Ivan Crespo Reyes',
    }
    this.bltService.clearBuffer();
    this.printLogo();
    setTimeout(() => {
      this.bltService.clearBuffer();
      this.bltService.checkConnectedDevice().then(async (isConnected) => {
        if (isConnected == "OK") {
          let result = await this.tickets.ticketVentaActivacion(data);
          this.bltService.writeTicket(result).then(async (writeTicket) => {
            console.log('Se imprimio?: ', writeTicket);
          }, async (notWriteTicket) => {
            console.log('No se imprimio', notWriteTicket);
          });
        }
      }, async (notConnected) => {
        console.log('No hay conectado', notConnected);
        this.serviceExport.toastMsg('No se cuenta con dispositivo conectado!', 'warning', 2500);
      });
    }, 1000);
  }

  convertImage() {
    this.tickets.convertImage();
  }
}
