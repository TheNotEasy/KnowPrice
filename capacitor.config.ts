import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.knowprice.app',
  appName: 'KnowPrice',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
};

export default config;
