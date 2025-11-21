import { ExpoConfig, ConfigContext } from 'expo/config';
import * as child_process from 'child_process';

const getGitCommitHash = () => {
  try {
    return child_process.execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    return 'DEV-MODE';
  }
};

const commitHash = getGitCommitHash();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Includ.IA",
  slug: "Includ.IA",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icone.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/icone.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icone.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: "./assets/icone.png"
  },
  plugins: [
    "expo-secure-store",
    "expo-web-browser"
  ],
  extra: {
    commitHash: commitHash,
    eas: {
      projectId: "seu-project-id-se-tiver"
    }
  }
});