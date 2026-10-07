import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "trailguard_token";
const DEVICE_KEY = "trailguard_selected_device";

export async function saveToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveSelectedDevice(deviceId) {
  if (deviceId) {
    await SecureStore.setItemAsync(DEVICE_KEY, deviceId);
  } else {
    await SecureStore.deleteItemAsync(DEVICE_KEY);
  }
}

export async function getSelectedDevice() {
  return SecureStore.getItemAsync(DEVICE_KEY);
}
