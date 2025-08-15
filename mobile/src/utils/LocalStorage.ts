// Minimal shim; can be backed by @react-native-async-storage/async-storage later
let currentTabIndex = '' as string;
let reloadDashboardData = false;
let reloadTrainingData = false;

export const KEY = {
  USER_NAME: 'user_name',
  USER_TOKEN: 'user_token',
  USER_EMAIL: 'user_email',
  USER_ROLE: 'user_role',
  API_DASHBOARD: 'api_dashboard_data',
  API_TRAINING: 'api_training_data',
} as const;

const mem = new Map<string, string>();
export async function saveData(key: string, value: string) { mem.set(key, value); }
export async function getData(key: string) { return mem.get(key) ?? null; }
export async function saveJsonData(key: string, value: any) { mem.set(key, JSON.stringify(value)); }
export async function getJsonData(key: string) { const v = mem.get(key); return v ? JSON.parse(v) : null; }
export async function saveMultipleData(entries: [string, string][]) { for (const [k,v] of entries) mem.set(k,v); }
export async function removeData(key: string) { mem.delete(key); }
export async function clearStorage() { mem.clear(); }
export async function keyExists(key: string) { return mem.has(key); }

export const getCurrentTabIndex = () => currentTabIndex;
export const setCurrentTabIndex = (v: string) => { currentTabIndex = v; };
export const getReloadDashboardData = () => reloadDashboardData;
export const setReloadDashboardData = (v: boolean) => { reloadDashboardData = v; };
export const getReloadTrainingData = () => reloadTrainingData;
export const setReloadTrainingData = (v: boolean) => { reloadTrainingData = v; };
