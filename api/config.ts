
const API_URL = {
  dev: process.env.EXPO_PUBLIC_API_URL_DEV,
  prod: process.env.EXPO_PUBLIC_API_URL_PROD,
};
const currentEnv = process.env.EXPO_PUBLIC_ENV as "dev" | "prod"

export const BASE_API_URL = API_URL[currentEnv];
export const USER_TOKEN = 'UTK_2024'; // it means USER_TOKEN_2024
