/**
 * Admin Configuration Management
 * Safely manages runtime API configuration with localStorage persistence
 * Falls back to environment variables if no localStorage value exists
 */

export interface AdminConfig {
  // Service URLs
  backendApiUrl: string;
  authServiceUrl: string;
  fileStorageUrl: string;
  notificationServiceUrl: string;
  websocketFcmUrl: string;
  paymentGatewayUrl: string;

  // API Keys
  publicApiKey: string;
  privateToken: string;
  firebaseKey: string;
  paymentKey: string;

  // Custom endpoints (user-defined)
  customEndpoints: Record<string, string>;
}

const STORAGE_KEY = "kaizen-admin-config";
const DEFAULT_CONFIG: AdminConfig = {
  backendApiUrl: "",
  authServiceUrl: "",
  fileStorageUrl: "",
  notificationServiceUrl: "",
  websocketFcmUrl: "",
  paymentGatewayUrl: "",
  publicApiKey: "",
  privateToken: "",
  firebaseKey: "",
  paymentKey: "",
  customEndpoints: {},
};

/**
 * Get the complete admin configuration
 * Priority: localStorage > environment variables > defaults
 */
export function getConfig(): AdminConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
      };
    }
  } catch (error) {
    console.warn("Failed to load admin config from localStorage:", error);
  }

  // Fallback to environment variables
  return {
    ...DEFAULT_CONFIG,
    backendApiUrl: import.meta.env.VITE_API_URL || "",
  };
}

/**
 * Get a specific API endpoint by key
 * Priority: localStorage custom > localStorage config > environment variables > defaults
 */
export function getAPI(key: string): string {
  const config = getConfig();

  // Check custom endpoints first
  if (config.customEndpoints[key]) {
    return config.customEndpoints[key];
  }

  // Check standard config keys
  if (key in config) {
    const value = config[key as keyof AdminConfig];
    if (typeof value === "string") {
      return value;
    }
  }

  // Fallback to environment variables for known keys
  const envMap: Record<string, string> = {
    backendApiUrl: import.meta.env.VITE_API_URL || "",
    // Add more env mappings as needed
  };

  return envMap[key] || "";
}

/**
 * Save admin configuration to localStorage
 */
export function saveConfig(config: Partial<AdminConfig>): void {
  try {
    const current = getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save admin config:", error);
    throw new Error("Failed to save configuration");
  }
}

/**
 * Reset admin configuration (clears localStorage)
 */
export function resetConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset admin config:", error);
    throw new Error("Failed to reset configuration");
  }
}

/**
 * Add or update a custom API endpoint
 */
export function setCustomEndpoint(key: string, url: string): void {
  try {
    const config = getConfig();
    config.customEndpoints[key] = url;
    saveConfig(config);
  } catch (error) {
    console.error("Failed to set custom endpoint:", error);
    throw new Error("Failed to set custom endpoint");
  }
}

/**
 * Remove a custom API endpoint
 */
export function removeCustomEndpoint(key: string): void {
  try {
    const config = getConfig();
    delete config.customEndpoints[key];
    saveConfig(config);
  } catch (error) {
    console.error("Failed to remove custom endpoint:", error);
    throw new Error("Failed to remove custom endpoint");
  }
}

/**
 * Export all config as JSON (for backup/export)
 */
export function exportConfig(): string {
  const config = getConfig();
  return JSON.stringify(config, null, 2);
}

/**
 * Import config from JSON (for restore/import)
 */
export function importConfig(json: string): void {
  try {
    const config = JSON.parse(json);
    if (typeof config !== "object") {
      throw new Error("Invalid configuration format");
    }
    saveConfig(config);
  } catch (error) {
    console.error("Failed to import config:", error);
    throw new Error("Invalid configuration format");
  }
}

/**
 * Reset all admin config to default values from environment or defaults
 * Clears localStorage and returns to environment variable state
 */
export function resetToDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Config will now fallback to environment variables via getConfig()
  } catch (error) {
    console.error("Failed to reset to defaults:", error);
    throw new Error("Failed to reset configuration to defaults");
  }
}
