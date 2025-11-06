import type { ExpoConfig } from "expo/config";

const CONFIG: ExpoConfig = {
  name: "windsurf-equilibrio",
  slug: "windsurf-equilibrio",
  scheme: "windsurf-equilibrio",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.yourcompany.windsurfequilibrio",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.yourcompany.windsurfequilibrio",
    softwareKeyboardLayoutMode: "pan",
    navigationBar: {
      visible: "sticky-immersive",
      barStyle: "dark-content",
      backgroundColor: "#0B0F14",
    },
    statusBar: {
      barStyle: "light-content",
      backgroundColor: "#0B0F14",
    },
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/favicon.png",
  },
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // Expo injects EXPO_PUBLIC_* no runtime (client). Não inclua segredos sem EXPO_PUBLIC_.
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? "dev",
    defaultLocale: process.env.EXPO_PUBLIC_DEFAULT_LOCALE ?? "pt-BR",
    eas: {
      projectId: "replace-with-eas-project-id-if-configured",
    },
  },
};

export default CONFIG;
