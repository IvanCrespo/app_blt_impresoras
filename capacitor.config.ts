import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.prueba_impresora',
  appName: 'Prueba Impresora',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
