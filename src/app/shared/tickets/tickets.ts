import { Injectable } from '@angular/core';

// Para encodear img
import EscPosEncoder from 'esc-pos-encoder-ionic';

@Injectable({
    providedIn: 'root'
})
export class Tickets {

    constructor() { }

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

    async convertImage() {
        let dataUrl = '../../assets/logo.png';
        const res = await fetch(dataUrl)
            .then(response => response.blob())
            .then(blob => {
                return blob;
            }).catch(error => {
                console.log('Error en Fetch', error)
                return;
            })

        return new Promise((resolve, reject) => {
            if (res) {
                const reader = new FileReader();
                reader.readAsDataURL(res);
                reader.onloadend = () => {
                    let base64data = reader.result;
                    console.log(base64data);
                    resolve(base64data);
                }
                reader.onerror = () => {
                    reject(null);
                }
            }
        });
    }
}