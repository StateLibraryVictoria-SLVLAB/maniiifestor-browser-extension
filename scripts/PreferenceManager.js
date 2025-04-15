import { storageNamespace } from "./constants.js";

class PreferenceManager {
  static instance;

  constructor(options = {}) {
    const {
      useSessionStorage = false,
      namespace = typeof storageNamespace !== "undefined"
        ? storageNamespace
        : "ls__",
    } = options;

    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.namespace = namespace;
    this.cache = {};
    this.cacheLifetime = 600000; // 10 minutes in milliseconds
  }

  static getInstance(options) {
    if (!PreferenceManager.instance) {
      PreferenceManager.instance = new PreferenceManager(options);
    }
    return PreferenceManager.instance;
  }

  getNamespacedKey(key) {
    return `${this.namespace}${key}`;
  }

  setPreference(key, value, expiresInMs = -1) {
    try {
      const storedPreference = {
        value: value,
        timestamp: Date.now(),
        expiresAt: expiresInMs === -1 ? -1 : Date.now() + expiresInMs,
      };

      const stringValue = JSON.stringify(storedPreference);
      this.storage.setItem(this.getNamespacedKey(key), stringValue);

      // Update cache
      this.cache[key] = { ...storedPreference, lastChecked: Date.now() };
    } catch (error) {
      console.error("Error saving preference:", error);
    }
  }

  getPreference(key, defaultValue) {
    // Check cache first
    if (this.cache[key] && !this.isCacheExpired(this.cache[key])) {
      return this.cache[key].value;
    }

    try {
      const value = this.storage.getItem(this.getNamespacedKey(key));
      if (!value) return defaultValue;

      const storedPreference = JSON.parse(value);
      if (this.isExpired(storedPreference)) {
        this.removePreference(key);
        return defaultValue;
      }

      // Update cache
      this.cache[key] = { ...storedPreference, lastChecked: Date.now() };
      return storedPreference.value;
    } catch (error) {
      console.error("Error retrieving preference:", error);
      return defaultValue;
    }
  }

  getPreferenceMetadata(key) {
    // Check cache first
    if (this.cache[key] && !this.isCacheExpired(this.cache[key])) {
      const { lastChecked, ...metadata } = this.cache[key];
      return metadata;
    }

    try {
      const value = this.storage.getItem(this.getNamespacedKey(key));
      if (!value) return null;

      const storedPreference = JSON.parse(value);
      if (this.isExpired(storedPreference)) {
        this.removePreference(key);
        return null;
      }

      // Update cache
      this.cache[key] = { ...storedPreference, lastChecked: Date.now() };
      return storedPreference;
    } catch (error) {
      console.error("Error retrieving preference metadata:", error);
      return null;
    }
  }

  removePreference(key) {
    this.storage.removeItem(this.getNamespacedKey(key));
    delete this.cache[key];
  }

  clearAllPreferences() {
    Object.keys(this.storage).forEach((key) => {
      if (key.startsWith(this.namespace)) {
        this.storage.removeItem(key);
      }
    });
    this.cache = {};
  }

  isExpired(preference) {
    return preference.expiresAt !== -1 && Date.now() > preference.expiresAt;
  }

  isCacheExpired(cachedPreference) {
    return Date.now() - cachedPreference.lastChecked > this.cacheLifetime;
  }

  invalidateCache(key) {
    delete this.cache[key];
  }

  setCacheLifetime(lifetime) {
    this.cacheLifetime = lifetime;
  }
}

export default PreferenceManager;
