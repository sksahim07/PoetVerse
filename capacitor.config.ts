import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.poetverse.app',
  appName: 'PoetVerse',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '994914434393-qmn96bvrlqk2piist6bjuk3f2qoevifu.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;