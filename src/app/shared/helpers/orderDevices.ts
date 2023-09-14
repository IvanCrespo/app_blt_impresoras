const diccionario: string[] = [
    "BlueTooth",
    "Printer",
    "STAR",
    "Printer001"
];

let nuevoResultado: any = [];

export const orderDevices = (lista: any): Promise<any> => {
    nuevoResultado = [];
    return new Promise(async (resolve) => {
        lista.forEach((element: any, index: number) => {
            if (element.name) {
                diccionario.map((palabra) => {
                    if (element.name.includes(palabra)) {
                        nuevoResultado.push(element)
                    };
                });
            }
        });
        let dataArr = new Set<any>(nuevoResultado);
        resolve([...dataArr]);
    });
}