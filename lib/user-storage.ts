interface UserData {
  email: string;
  name: string;
  createdAt: string;
  preferences: UserPreferences;
  tier: "free" | "premium";
  trialEndsAt?: string;
}

interface UserPreferences {
  defaultCurrency: string;
  notifications: {
    email: boolean;
    push: boolean;
    telegram: boolean;
    whatsapp: boolean;
  };
  theme: "light" | "dark" | "system";
  alertSettings: {
    soundEnabled: boolean;
    frequency: "immediate" | "hourly" | "daily";
  };
}

interface UserAlert {
  id: string;
  userId: string;
  currency: string;
  rateType: "official" | "black_market" | "remittance";
  condition: "above" | "below";
  threshold: number;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  // Optional arbitrary data payload for additional metadata
  data?: Record<string, any>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultCurrency: "USD",
  notifications: {
    email: true,
    push: false,
    telegram: false,
    whatsapp: false,
  },
  theme: "system",
  alertSettings: {
    soundEnabled: true,
    frequency: "immediate",
  },
};

export class UserStorage {
  private static readonly USER_KEY = "nairamet-user";
  private static readonly ALERTS_KEY = "nairamet-alerts";
  private static readonly PREFERENCES_KEY = "nairamet-preferences";

  // User Management
  static saveUser(user: {
    email: string;
    name: string;
    tier?: "free" | "premium";
    trialEndsAt?: Date;
  }): UserData {
    const userData: UserData = {
      ...user,
      createdAt: new Date().toISOString(),
      preferences: DEFAULT_PREFERENCES,
      tier: user.tier || "free",
      trialEndsAt: user.trialEndsAt?.toISOString(),
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    return userData;
  }

  static getUser(): UserData | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static updateUser(updates: Partial<UserData>): UserData | null {
    const currentUser = this.getUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }

  static removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ALERTS_KEY);
    localStorage.removeItem(this.PREFERENCES_KEY);
  }

  // Preferences Management
  static getPreferences(): UserPreferences {
    const user = this.getUser();
    if (user?.preferences) return user.preferences;

    const savedPrefs = localStorage.getItem(this.PREFERENCES_KEY);
    return savedPrefs ? JSON.parse(savedPrefs) : DEFAULT_PREFERENCES;
  }

  static updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const currentPrefs = this.getPreferences();
    const updatedPrefs = { ...currentPrefs, ...updates };

    // Update in user data
    const user = this.getUser();
    if (user) {
      this.updateUser({ preferences: updatedPrefs });
    }

    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updatedPrefs));
    return updatedPrefs;
  }

  // Alerts Management
  static getUserAlerts(): UserAlert[] {
    const user = this.getUser();
    if (!user) return [];

    const alerts = localStorage.getItem(this.ALERTS_KEY);
    const allAlerts: UserAlert[] = alerts ? JSON.parse(alerts) : [];
    return allAlerts.filter((alert) => alert.userId === user.email);
  }

  static saveAlert(
    alert: Omit<UserAlert, "id" | "userId" | "createdAt">
  ): UserAlert {
    const user = this.getUser();
    if (!user) throw new Error("User must be logged in to save alerts");

    const newAlert: UserAlert = {
      ...alert,
      id: crypto.randomUUID(),
      userId: user.email,
      createdAt: new Date().toISOString(),
    };

    const existingAlerts = this.getAllAlerts();
    const updatedAlerts = [...existingAlerts, newAlert];
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(updatedAlerts));

    return newAlert;
  }

  /**
   * Convenience method to create a rate alert with optional custom data.
   */
  static rateAlert(
    params: {
      currency: string;
      rateType: "official" | "black_market" | "remittance" | "parallel";
      condition: "above" | "below";
      threshold: number;
      isActive?: boolean;
    },
    data?: Record<string, any>
  ): UserAlert {
    return this.saveAlert({
      currency: params.currency,
      rateType: params.rateType,
      condition: params.condition,
      threshold: params.threshold,
      isActive: params.isActive ?? true,
      data,
    });
  }

  static updateAlert(
    alertId: string,
    updates: Partial<UserAlert>
  ): UserAlert | null {
    const alerts = this.getAllAlerts();
    const alertIndex = alerts.findIndex((alert) => alert.id === alertId);

    if (alertIndex === -1) return null;

    alerts[alertIndex] = { ...alerts[alertIndex], ...updates };
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));

    return alerts[alertIndex];
  }

  static deleteAlert(alertId: string): boolean {
    const alerts = this.getAllAlerts();
    const filteredAlerts = alerts.filter((alert) => alert.id !== alertId);

    if (filteredAlerts.length === alerts.length) return false;

    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(filteredAlerts));
    return true;
  }

  private static getAllAlerts(): UserAlert[] {
    const alerts = localStorage.getItem(this.ALERTS_KEY);
    return alerts ? JSON.parse(alerts) : [];
  }

  // User Statistics
  static getUserStats() {
    const user = this.getUser();
    if (!user) return null;

    const alerts = this.getUserAlerts();
    const preferences = this.getPreferences();

    return {
      joinDate: user.createdAt,
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter((alert) => alert.isActive).length,
      triggeredAlerts: alerts.filter((alert) => alert.lastTriggered).length,
      preferredCurrency: preferences.defaultCurrency,
      notificationsEnabled: Object.values(preferences.notifications).some(
        Boolean
      ),
    };
  }

  // Data Export/Import
  static exportUserData(): string {
    const user = this.getUser();
    const alerts = this.getUserAlerts();
    const preferences = this.getPreferences();

    return JSON.stringify(
      {
        user,
        alerts,
        preferences,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  }

  static importUserData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
      }

      if (data.alerts) {
        localStorage.setItem(this.ALERTS_KEY, JSON.stringify(data.alerts));
      }

      if (data.preferences) {
        localStorage.setItem(
          this.PREFERENCES_KEY,
          JSON.stringify(data.preferences)
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to import user data:", error);
      return false;
    }
  }

  // Premium Feature Limits Checking
  static canCreateAlert(): { allowed: boolean; reason?: string } {
    const user = this.getUser();
    if (!user) return { allowed: false, reason: "User not logged in" };

    const alerts = this.getUserAlerts();
    // All users can create unlimited alerts
    return { allowed: true };
  }

  static canAccessHistoricalData(days: number): {
    allowed: boolean;
    reason?: string;
  } {
    const user = this.getUser();
    if (!user) return { allowed: false, reason: "User not logged in" };

    // Allow all users to access historical data
    return { allowed: true };
  }

  static canAccessRateLogs(): { allowed: boolean; reason?: string } {
    const user = this.getUser();
    if (!user) return { allowed: false, reason: "User not logged in" };

    // Make rate logs available to all users
    return { allowed: true };
  }

  static canExportData(): { allowed: boolean; reason?: string } {
    const user = this.getUser();
    if (!user) return { allowed: false, reason: "User not logged in" };

    // Allow data export for all users
    return { allowed: true };
  }
}
