const diccionario: string[] = [
    "BlueTooth",
    "Printer",
    "STAR",
    "Printer001"
];

let nuevoResultado: any = [];

export const orderDevices = (lista: any) => {
    nuevoResultado = [];
    lista.forEach((element: any, index: number) => {
        if (element.name) {
            diccionario.forEach((palabra: string) => {
                if (element.name.includes(palabra)) nuevoResultado.push(element);;
            });
        }
    });
    const dataArr = new Set(nuevoResultado);
    return [...dataArr];
}