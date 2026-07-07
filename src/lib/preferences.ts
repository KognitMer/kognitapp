export const SUPPORTED_LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "hi", label: "हिन्दी" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja", label: "日本語" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const KEYS = {
  darkMode: "kognit:dark-mode",
  sound: "kognit:sound-enabled",
  vibration: "kognit:vibration-enabled",
  language: "kognit:language",
  notificationsEnabled: "kognit:notifications-enabled",
  notificationSound: "kognit:notification-sound",
} as const;

export const NOTIFICATION_SOUNDS = ["soft", "classic", "alert"] as const;
export type NotificationSoundId = (typeof NOTIFICATION_SOUNDS)[number];

export function getDarkMode(): boolean {
  return localStorage.getItem(KEYS.darkMode) === "1";
}

export function setDarkMode(enabled: boolean) {
  localStorage.setItem(KEYS.darkMode, enabled ? "1" : "0");
  document.documentElement.classList.toggle("dark", enabled);
}

export function applyStoredDarkMode() {
  document.documentElement.classList.toggle("dark", getDarkMode());
}

export function getSoundEnabled(): boolean {
  return localStorage.getItem(KEYS.sound) === "1";
}

export function setSoundEnabled(enabled: boolean) {
  localStorage.setItem(KEYS.sound, enabled ? "1" : "0");
}

export function getVibrationEnabled(): boolean {
  return localStorage.getItem(KEYS.vibration) !== "0";
}

export function setVibrationEnabled(enabled: boolean) {
  localStorage.setItem(KEYS.vibration, enabled ? "1" : "0");
}

export function getNotificationsEnabled(): boolean {
  return localStorage.getItem(KEYS.notificationsEnabled) !== "0";
}

export function setNotificationsEnabled(enabled: boolean) {
  localStorage.setItem(KEYS.notificationsEnabled, enabled ? "1" : "0");
}

export function getNotificationSound(): NotificationSoundId {
  const stored = localStorage.getItem(KEYS.notificationSound);
  return (NOTIFICATION_SOUNDS as readonly string[]).includes(stored ?? "") ? (stored as NotificationSoundId) : "classic";
}

export function setNotificationSound(id: NotificationSoundId) {
  localStorage.setItem(KEYS.notificationSound, id);
}

export function getLanguage(): LanguageCode {
  const stored = localStorage.getItem(KEYS.language);
  return (SUPPORTED_LANGUAGES.some(l => l.code === stored) ? stored : "es") as LanguageCode;
}

export function setLanguage(code: LanguageCode) {
  localStorage.setItem(KEYS.language, code);
}
