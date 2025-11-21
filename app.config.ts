import { ExpoConfig, ConfigContext } from 'expo/config';
import * as child_process from 'child_process';

// Função para pegar o hash do commit
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
  name: "IncludIA-Mobile",
  slug: "IncludIA-Mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: "./assets/favicon.png"
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