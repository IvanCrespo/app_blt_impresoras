import { Injectable } from '@angular/core';

// Para encodear img
import EscPosEncoder from 'esc-pos-encoder-ionic';

// Plugins
import { CommandsArray, StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';

@Injectable({
    providedIn: 'root'
})
export class Tickets {

    /* Impresora starPRNT */
    commands!: CommandsArray

    constructor(
        private starprnt: StarPRNT,
    ) { }

    async ticketLogo() {
        const image = await new Promise((resolve) => {
            let encoder = new EscPosEncoder();
            let img = new Image();
            let resultByte = null;
            img.src = '../../assets/logo.png'
            const result = encoder.initialize();
            img.onload = () => {
                result.image(img, 360, 304, 'bayer')
                resultByte = result.encode();
                // Enviando a write BLT Serial
                resolve(resultByte);
            }
        });
        return image;
    }

    ticketQR(qr: string) {
        var qr_model = '\x32'; // 31 or 32
        var qr_size = '\x06'; // size
        var qr_eclevel = '\x49'; // error correction level (30, 31, 32, 33 - higher)
        var qr_data = qr;
        var qr_pL = String.fromCharCode((qr_data.length + 3) % 256);
        var qr_pH = String.fromCharCode((qr_data.length + 3) / 256);
        let data;
        data =
            "\n"
            + "\x1B\x61\x01" // Centralizar texto
            + "\x1D\x28\x6B\x04\x00\x31\x41" + qr_model + "\x00" // Select the model
            + "\x1D\x28\x6B\x03\x00\x31\x43" + qr_size // Size of the model
            + "\x1D\x28\x6B\x03\x00\x31\x45" + qr_eclevel // Set n for error correction
            + "\x1D\x28\x6B" + qr_pL + qr_pH + "\x31\x50\x30" + qr_data // Store data
            + "\x1D\x28\x6B\x03\x00\x31\x51\x30" + "\n\n\n\n";
        return data;
    }

    async ticketVentaActivacion(datos: any) {
        let printData = "\x1b\x45\x01"//Bold ON
            + "\x1b\x21\x30"//Double width & height text
            + "                        ORIGINAL\n"
            + "\x1b\x45\x00"//Bold OFF
            + "\x1b\x21\x00"//Text normal
            + `                Folio: ${datos.folio}\n`
            + ` Fecha/Hora: ${datos.fecha}\n`
            + "                                \n"
            + "\x1b\x21\x10"//Double width & height text
            + "            TICKET      \n"
            + "          DE EJEMPLO        \n"
            + "\x1b\x21\x00"//Text normal
            + "                                \n"
            + "--------------------------------\n"
            + "\x1b\x45\x01"//Bold ON
            + "Cant.   Art.    Precio   Total    \n"
            + "\x1b\x45\x00"//Bold OFF
            + "--------------------------------\n"
            + `1      TP${datos.tarjeta}    $${datos.costo}   $${datos.costo}  \n`
            + "                                \n"
            + "\x1b\x45\x01"//Bold ON
            + `       TOTAL M.N. $${datos.costo}  \n`
            + "\x1b\x45\x00"//Bold OFF
            + "                                \n"
            + "           Supervisor           \n"
            + "\x1b\x45\x01"//Bold ON
            + `        ${datos.supervisor}         \n`
            + "\x1b\x45\x00"//Bold OFF
            + "                                \n"
            + "\x1b\x45\x01"//Bold ON
            + "     *CONSERVE ESTE TICKET*     \n"
            + "ESTE TICKET NO ES UN COMPROBANTE\n"
            + "            FISCAL              \n"
            + "\x1b\x45\x00"//Bold OFF
            + "                                \n";
        let result = this.ticketQR(datos.folio);
        return printData + result;
    }

    qrPRNT(): CommandsArray {
        let twoInchReceipt: CommandsArray = [];
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
        twoInchReceipt.push({
            appendQrCode: 'Hola prueba starPRNT',
            QrCodeModel: "No2",
            QrCodeLevel: "L",
            cell: 8,
            alignment: "Center",
            absolutePosition: 120
        });
        twoInchReceipt.push({ appendLineFeed: 1 });
        return twoInchReceipt;
    }

    ticketPRNT(): CommandsArray {
        let twoInchReceipt: CommandsArray = [];
        twoInchReceipt.push({ appendInternational: this.starprnt.InternationalType.LatinAmerica });
        twoInchReceipt.push({ appendEncoding: this.starprnt.Encoding.UTF8 })
        twoInchReceipt.push({ appendCharacterSpace: 0 });
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Right });
        twoInchReceipt.push({ appendMultiple: "ORIGINAL" + "\n", width: 1, height: 2 });
        twoInchReceipt.push({ appendEmphasis: "Folio: " + 'ABCD12345' + "\n" });
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Left });
        twoInchReceipt.push({ append: "Fecha/Hora: " });
        twoInchReceipt.push({ appendEmphasis: "14 de Septiembre del 2023, 11:15:00 a.m" + "\n\n" });
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
        twoInchReceipt.push({ appendMultiple: "VENTA Y ACTIVACION DE\nTARJETA DE PREPAGO\n\n", width: 1, height: 2 });
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Left });
        twoInchReceipt.push({ append: "--------------------------------\n" });
        twoInchReceipt.push({ appendHorizontalTabPosition: [6, 16, 25, 34] });
        twoInchReceipt.push({ appendEmphasis: "Cant.   Art.   Precio   Total\n" });
        twoInchReceipt.push({ append: "--------------------------------\n" });
        twoInchReceipt.push({
            append:
                "1" + "     " +
                "TP" + "0070" + "   $" +
                "200.00" + "   $" +
                "200.00" + "\n\n"
        });
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Right });
        twoInchReceipt.push({ appendEmphasis: "TOTAL M.N.  " + "$" + "200.00" + "\n\n" });
        twoInchReceipt.push({ appendAlignment: this.starprnt.AlignmentPosition.Center });
        twoInchReceipt.push({ append: "Supervisor: \n" });
        twoInchReceipt.push({ appendEmphasis: "Ivan Crespo Reyes" + "\n\n" });
        twoInchReceipt.push({ appendEmphasis: "*CONSERVE ESTE TICKET*\n" });
        twoInchReceipt.push({ appendEmphasis: "ESTE TICKET NO ES UN COMPROBANTE FISCAL\n" });
        return twoInchReceipt;
    }
}