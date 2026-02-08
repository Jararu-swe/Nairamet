"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  Smartphone,
  SmartphoneNfc,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useAlertStorage } from "@/hooks/use-alert-storage";
import { useRateMonitor } from "@/hooks/use-rate-monitor";
import { MonitoringDashboard } from "@/components/monitoring-dashboard";
import { useAuth } from "@/contexts/auth-context";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { LazyStickySkyscraperAdWrapper } from "@/components/lazy-ad-wrappers";

// Helper function to get country code for currency
const getCountryCodeForCurrency = (currency: string): string => {
  const mapping: Record<string, string> = {
    USD: "us",
    GBP: "gb",
    EUR: "eu",
    CNY: "cn",
    JPY: "jp",
    CAD: "ca",
    AUD: "au",
    CHF: "ch",
    ZAR: "za",
    INR: "in",
    AED: "ae",
    SAR: "sa",
    KES: "ke",
    GHS: "gh",
    EGP: "eg",
    NGN: "ng",
    BRL: "br",
    MXN: "mx",
    ARS: "ar",
    CLP: "cl",
    COP: "co",
    PEN: "pe",
    TRY: "tr",
    RUB: "ru",
    PLN: "pl",
    SEK: "se",
    NOK: "no",
    DKK: "dk",
    CZK: "cz",
    HUF: "hu",
  };
  return mapping[currency.toUpperCase()] || "un";
};

// Helper function to get flag URL
const getFlagUrl = (currency: string): string => {
  const countryCode = getCountryCodeForCurrency(currency);
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

interface ExchangeRate {
  currency: string;
  symbol: string;
  flag: string;
  cbn: number;
  blackMarket: number;
  remittance: number;
  change24h: number;
  lastUpdated: string;
}

// Expanded currency list with symbols and flags
const CURRENCY_CONFIG = [
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
  { code: "CNY", symbol: "¥", flag: "🇨🇳", name: "Chinese Yuan" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", flag: "🇨🇦", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", flag: "🇨🇭", name: "Swiss Franc" },
  { code: "ZAR", symbol: "R", flag: "🇿🇦", name: "South African Rand" },
  { code: "INR", symbol: "₹", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "KES", symbol: "KSh", flag: "🇰🇪", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "₵", flag: "🇬🇭", name: "Ghanaian Cedi" },
  { code: "EGP", symbol: "£", flag: "🇪🇬", name: "Egyptian Pound" },
];

function AlertsPageContent() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { toasts, removeToast, success, error, info } = useToast();
  const [rates, setRates] = useState<ExchangeRate[]>(
    CURRENCY_CONFIG.map((curr) => ({
      currency: curr.code,
      symbol: curr.symbol,
      flag: curr.flag,
      cbn: 0,
      blackMarket: 0,
      remittance: 0,
      change24h: 0,
      lastUpdated: new Date().toLocaleTimeString(),
    })),
  );
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch real-time rates from tracker API (accurate rates)
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        // Use tracker API for accurate real-time rates
        const response = await fetch("/api/tracker", {
          cache: "no-store",
          next: { revalidate: 0 },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rates");
        }

        const data = await response.json();
        const trackerRates = data.rates || [];

        if (Array.isArray(trackerRates) && trackerRates.length > 0) {
          const updatedRates = trackerRates
            .map((rate: any) => {
              const currencyCode = String(rate.currency || "").toUpperCase();
              const config = CURRENCY_CONFIG.find(
                (c) => c.code === currencyCode,
              );

              if (!config) return null;

              // Extract real rates from tracker
              const cbnRate = Number(
                rate.official || rate.cbn || rate.cbnRate || rate.cbn_rate || 0,
              );
              const blackMarketRate = Number(
                rate.blackMarket || rate.black_market || rate.black || 0,
              );
              const remittanceRate = Number(
                rate.remittance || rate.parallel || rate.parallelMarket || 0,
              );

              // Only include if we have at least one valid rate
              if (
                cbnRate === 0 &&
                blackMarketRate === 0 &&
                remittanceRate === 0
              ) {
                return null;
              }

              return {
                currency: currencyCode,
                symbol: config.symbol,
                flag: config.flag,
                cbn: cbnRate,
                blackMarket: blackMarketRate || cbnRate * 1.03, // Fallback to 3% above CBN if not available
                remittance: remittanceRate || cbnRate * 1.01, // Fallback to 1% above CBN if not available
                change24h: 0, // Can be calculated if historical data available
                lastUpdated: new Date().toLocaleTimeString(),
              };
            })
            .filter(Boolean); // Remove null entries

          if (updatedRates.length > 0) {
            setRates(updatedRates as ExchangeRate[]);
            console.log(
              "[Alerts] Loaded accurate rates for",
              updatedRates.length,
              "currencies",
            );
          }
        }
      } catch (error) {
        console.error("[Alerts] Error fetching rates:", error);
        // Keep existing rates on error
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchRates();
    // Refresh rates every 60 seconds for accurate monitoring
    const interval = setInterval(fetchRates, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [newAlert, setNewAlert] = useState({
    currency: "USD",
    rateType: "blackMarket" as const,
    condition: "above" as const,
    threshold: "",
    email: user?.email || "",
    pushEnabled: false,
  });

  // Update email when user signs in
  useEffect(() => {
    if (user?.email && !newAlert.email) {
      setNewAlert((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, [user?.email]);

  const {
    isSupported,
    isSubscribed,
    isLoading,
    userId,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotifications();

  const handleSubscribe = async () => {
    const result = await subscribe();
    if (result) {
      success("Push notifications enabled!");
    } else {
      error(
        "Failed to enable push notifications. Please check browser permissions.",
      );
    }
  };

  const handleUnsubscribe = async () => {
    const result = await unsubscribe();
    if (result) {
      info("Push notifications disabled");
    } else {
      error("Failed to disable push notifications");
    }
  };

  const handleTestNotification = async () => {
    const result = await sendTestNotification();
    if (result) {
      success("Test notification sent!");
    } else {
      error("Failed to send test notification");
    }
  };

  const {
    alerts,
    alertHistory,
    alertSettings,
    addAlert,
    updateAlert,
    deleteAlert: deleteAlertHook,
    addAlertHistory,
    clearAlertHistory,
    updateSettings,
    getAlertStats,
    exportData,
    importData,
  } = useAlertStorage();

  const handleAlertTriggered = async (alert: any, currentRate: number) => {
    console.log(
      `[Alerts] Processing triggered alert: ${alert.currency} ${alert.condition} ₦${alert.threshold}`,
    );

    let emailSent = false;
    let pushSent = false;

    // Send email notification
    try {
      const response = await fetch("/api/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: alert.email,
          currency: alert.currency,
          condition: alert.condition,
          threshold: alert.threshold,
          currentRate: currentRate,
          rateType: alert.rateType,
        }),
      });
      const result = await response.json();
      emailSent = result.success;

      if (emailSent) {
        console.log("[Alerts] Email notification sent successfully");
      } else {
        console.error("[Alerts] Email notification failed:", result.error);
      }
    } catch (error) {
      console.error("[Alerts] Error sending alert email:", error);
    }

    // Send push notification if enabled
    if (alert.pushEnabled && isSubscribed && userId) {
      try {
        const response = await fetch("/api/send-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            currency: alert.currency,
            condition: alert.condition,
            threshold: alert.threshold,
            currentRate: currentRate,
            rateType: alert.rateType,
          }),
        });
        const result = await response.json();
        pushSent = result.success;

        if (pushSent) {
          console.log("[Alerts] Push notification sent successfully");
        } else {
          console.error("[Alerts] Push notification failed:", result.error);
        }
      } catch (error) {
        console.error("[Alerts] Error sending push notification:", error);
      }
    }

    // Add to alert history
    addAlertHistory(
      alert.id,
      alert.currency,
      alert.condition,
      alert.threshold,
      currentRate,
      alert.rateType,
      {
        email: emailSent,
        push: pushSent,
      },
    );

    // Show success toast
    if (emailSent || pushSent) {
      success(
        `Alert sent! ${alert.currency} is now ${alert.condition} ₦${alert.threshold}`,
      );
    }
  };

  const {
    isMonitoring,
    forceCheck,
    getMonitoringStats,
    emailQuotaUsed,
    lastEmailSent,
  } = useRateMonitor(
    rates,
    alerts,
    handleAlertTriggered,
    alertSettings.checkInterval,
  );

  const getNextEmailDate = () => {
    if (!lastEmailSent) return null;
    const next = new Date(lastEmailSent);
    next.setMonth(next.getMonth() + 1);
    return next;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRateTypeLabel = (type: string) => {
    switch (type) {
      case "cbn":
        return "CBN Official";
      case "blackMarket":
        return "Black Market";
      case "remittance":
        return "Remittance";
      default:
        return type;
    }
  };

  const createAlert = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      openAuthModal();
      info("Please sign in to create alerts");
      return;
    }

    // Check if user already has an alert
    if (alerts.length >= 1) {
      error(
        "You can only create one rate alert. Delete your existing alert to create a new one.",
      );
      return;
    }

    if (!newAlert.threshold) {
      error("Please enter a threshold value");
      return;
    }

    // Use authenticated user's email
    const alertEmail = user?.email || newAlert.email;

    if (!alertEmail || !alertEmail.includes("@")) {
      error("Please enter a valid email address");
      return;
    }

    addAlert({
      currency: newAlert.currency,
      rateType: newAlert.rateType,
      condition: newAlert.condition,
      threshold: Number.parseFloat(newAlert.threshold),
      email: alertEmail,
      pushEnabled: newAlert.pushEnabled && isSubscribed,
      isActive: true,
    });

    success(
      `Alert created: ${newAlert.currency} ${newAlert.condition} ₦${newAlert.threshold}`,
    );

    setNewAlert({
      currency: "USD",
      rateType: "blackMarket",
      condition: "above",
      threshold: "",
      email: user?.email || "",
      pushEnabled: false,
    });
  };

  const toggleAlert = (id: string) => {
    const alert = alerts.find((a) => a.id === id);
    if (alert) {
      updateAlert(id, { isActive: !alert.isActive });
      info(`Alert ${!alert.isActive ? "activated" : "deactivated"}`);
    }
  };

  const deleteAlert = (id: string) => {
    deleteAlertHook(id);
    success("Alert deleted successfully");
  };

  const checkAlertTrigger = (alert: any) => {
    const rate = rates.find((r) => r.currency === alert.currency);
    if (!rate) {
      console.warn(`[Alerts] No rate found for currency: ${alert.currency}`);
      return false;
    }

    const currentRate = rate[alert.rateType as keyof ExchangeRate] as number;

    if (!currentRate || currentRate === 0) {
      console.warn(
        `[Alerts] Invalid rate for ${alert.currency} ${alert.rateType}: ${currentRate}`,
      );
      return false;
    }

    const isTriggered =
      alert.condition === "above"
        ? currentRate > alert.threshold
        : currentRate < alert.threshold;

    if (isTriggered) {
      console.log(
        `[Alerts] Alert triggered: ${alert.currency} ${alert.rateType} is ${alert.condition} ₦${alert.threshold} (current: ₦${currentRate})`,
      );
    }

    return isTriggered;
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
            {/* Monthly Email Quota Banner */}
            <Card
              className={
                emailQuotaUsed
                  ? "border-red-200 bg-red-50 dark:bg-red-950/20"
                  : "border-green-200 bg-green-50 dark:bg-green-950/20"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div
                    className={
                      emailQuotaUsed
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }
                  >
                    {emailQuotaUsed ? "📧" : "✅"}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-1 ${emailQuotaUsed ? "text-red-900 dark:text-red-100" : "text-green-900 dark:text-green-100"}`}
                    >
                      {emailQuotaUsed
                        ? "Monthly Email Quota Used"
                        : "Email Quota Available"}
                    </h3>
                    <p
                      className={`text-sm mb-2 ${emailQuotaUsed ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"}`}
                    >
                      {emailQuotaUsed
                        ? `You've used your 1 email alert for this month. Your next email will be available on ${formatDate(getNextEmailDate())}.`
                        : "You have 1 email alert available this month. Your alert will send an email when triggered."}
                    </p>
                    {lastEmailSent && (
                      <p
                        className={`text-xs ${emailQuotaUsed ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}
                      >
                        Last email sent: {formatDate(lastEmailSent)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Rate Alerts
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get notified when exchange rates hit your targets
                </p>
                {isLoadingRates && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Fetching latest rates...
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div
                    className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                  />
                  {isMonitoring ? "Monitoring active" : "Monitoring inactive"}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("[Alerts] Manual check triggered");
                      forceCheck();
                      info("Checking alerts now...");
                    }}
                    className="bg-transparent flex-1 sm:flex-none"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Check Now</span>
                    <span className="sm:hidden">Check</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="bg-transparent flex-1 sm:flex-none"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Refresh Rates</span>
                    <span className="sm:hidden">Refresh</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Push Notifications Setup */}
            {isSupported && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Push Notifications
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications on your device
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`p-2 rounded-full ${isSubscribed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                      >
                        {isSubscribed ? (
                          <SmartphoneNfc className="w-4 h-4" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          {isSubscribed
                            ? "Push notifications enabled"
                            : "Enable push notifications"}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {isSubscribed
                            ? "You will receive instant alerts when rates change"
                            : "Get notified instantly when your rate alerts trigger"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      {isSubscribed ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTestNotification}
                            className="bg-transparent flex-1 sm:flex-none"
                          >
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUnsubscribe}
                            disabled={isLoading}
                            className="bg-transparent flex-1 sm:flex-none"
                          >
                            {isLoading ? "Loading..." : "Disable"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleSubscribe}
                          disabled={isLoading}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {isLoading ? "Loading..." : "Enable"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rate Alerts section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Manage Alerts
                  </div>
                  <Badge
                    variant="outline"
                    className="text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  >
                    {alerts.length}/1 Alert Used
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {alerts.length >= 1
                    ? "You have reached your alert limit. Delete your existing alert to create a new one."
                    : "Create one rate alert to get notified when rates hit your target"}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create New Alert */}
                {alerts.length < 1 ? (
                  <div className="border rounded-lg p-3 sm:p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <h3 className="font-semibold">Create Your Alert</h3>
                      {!isAuthenticated && (
                        <Button
                          onClick={() => openAuthModal()}
                          size="sm"
                          variant="outline"
                          className="text-xs w-full sm:w-auto"
                        >
                          Sign In to Create Alert
                        </Button>
                      )}
                    </div>
                    {!isAuthenticated && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          💡 <strong>Sign in required:</strong> You need to sign
                          in to create and manage rate alerts. Your email will
                          be used for notifications.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="text-sm font-medium mb-2 block">
                          Currency
                        </label>
                        <Select
                          value={newAlert.currency}
                          onValueChange={(value) =>
                            setNewAlert((prev) => ({
                              ...prev,
                              currency: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rates.map((rate) => {
                              const config = CURRENCY_CONFIG.find(
                                (c) => c.code === rate.currency,
                              );
                              return (
                                <SelectItem
                                  key={rate.currency}
                                  value={rate.currency}
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={getFlagUrl(rate.currency)}
                                      alt={rate.currency}
                                      className="w-5 h-4 rounded border object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                    <span className="truncate">
                                      {rate.currency} -{" "}
                                      {config?.name || rate.currency}
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Rate Type
                        </label>
                        <select
                          value={newAlert.rateType}
                          onChange={(e) =>
                            setNewAlert((prev) => ({
                              ...prev,
                              rateType: e.target.value as any,
                            }))
                          }
                          className="w-full p-2 rounded-md border bg-background text-sm"
                        >
                          <option value="blackMarket">Black Market</option>
                          <option value="cbn">CBN Official</option>
                          <option value="remittance">Remittance</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Condition
                        </label>
                        <select
                          value={newAlert.condition}
                          onChange={(e) =>
                            setNewAlert((prev) => ({
                              ...prev,
                              condition: e.target.value as any,
                            }))
                          }
                          className="w-full p-2 rounded-md border bg-background text-sm"
                        >
                          <option value="above">Above</option>
                          <option value="below">Below</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Threshold (₦)
                        </label>
                        <Input
                          value={newAlert.threshold}
                          onChange={(e) =>
                            setNewAlert((prev) => ({
                              ...prev,
                              threshold: e.target.value,
                            }))
                          }
                          placeholder="1600"
                          type="number"
                          className="text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="text-sm font-medium mb-2 block">
                          Email
                        </label>
                        <Input
                          value={
                            isAuthenticated ? user?.email || "" : newAlert.email
                          }
                          onChange={(e) =>
                            !isAuthenticated &&
                            setNewAlert((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder={
                            isAuthenticated
                              ? user?.email || "your@email.com"
                              : "Sign in to use your email"
                          }
                          type="email"
                          readOnly={isAuthenticated}
                          disabled={isAuthenticated}
                          className={`text-sm ${
                            isAuthenticated ? "bg-muted cursor-not-allowed" : ""
                          }`}
                        />
                        {isAuthenticated && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Using your account email
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Notification method toggle */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Notification Methods
                      </label>

                      {/* Push notification (PRIMARY - featured first) */}
                      {isSupported && (
                        <div
                          className={`flex items-start gap-3 p-4 border-2 rounded-lg ${
                            isSubscribed
                              ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-300 dark:border-emerald-700"
                              : "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-300 dark:border-blue-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="pushNotificationsEnabled"
                            checked={newAlert.pushEnabled}
                            onChange={(e) =>
                              setNewAlert((prev) => ({
                                ...prev,
                                pushEnabled: e.target.checked,
                              }))
                            }
                            disabled={!isSubscribed}
                            className="mt-0.5 rounded"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor="pushNotificationsEnabled"
                              className="text-sm font-bold flex items-center gap-2 cursor-pointer"
                            >
                              <Bell className="w-5 h-5" />
                              Push Notifications (Recommended)
                            </label>
                            <p className="text-xs font-medium mt-1">
                              {isSubscribed
                                ? "✅ Instant browser alerts • Unlimited • No delays"
                                : "⚡ Enable push notifications above for instant alerts"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Email notification (secondary - smaller) */}
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30 border-muted">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="mt-0.5 rounded opacity-50"
                        />
                        <div className="flex-1">
                          <label className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
                            <Bell className="w-3.5 h-3.5" />
                            Email Backup (Optional)
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            1 email per month • Slower delivery
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                        <p className="text-xs text-emerald-800 dark:text-emerald-200">
                          <strong>⚡ Best Experience:</strong>{" "}
                          {isSupported && isSubscribed
                            ? "Push notifications enabled! You'll get instant alerts with no limits."
                            : "Enable push notifications above for instant, unlimited alerts delivered directly to your device."}
                        </p>
                      </div>
                    </div>

                    <Button onClick={createAlert} className="w-full md:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                ) : (
                  <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-6 bg-amber-50 dark:bg-amber-950/20">
                    <div className="flex items-start gap-3">
                      <div className="text-amber-600 dark:text-amber-400 text-2xl">
                        ⚠️
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                          Alert Limit Reached
                        </h3>
                        <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                          You can only have one active rate alert at a time. To
                          create a new alert, please delete your existing alert
                          below.
                        </p>
                        <div className="text-xs text-amber-700 dark:text-amber-300">
                          💡 <strong>Tip:</strong> You can modify your existing
                          alert by deleting it and creating a new one with
                          different settings.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Alerts */}
                {alerts.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Your Alert</h3>
                      <div className="text-xs text-muted-foreground">
                        💡 Alerts send once per trigger
                      </div>
                    </div>
                    <div className="space-y-2">
                      {alerts.map((alert) => {
                        const isTriggered = checkAlertTrigger(alert);
                        const rate = rates.find(
                          (r) => r.currency === alert.currency,
                        );
                        const currentRate = rate?.[alert.rateType] || 0;
                        const hasBeenTriggered = alertHistory.some(
                          (h) =>
                            h.alertId === alert.id &&
                            h.notificationsSent?.email,
                        );

                        return (
                          <div
                            key={alert.id}
                            className={`rounded-lg border ${
                              isTriggered && alert.isActive
                                ? hasBeenTriggered
                                  ? "bg-amber-50 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800"
                                  : "bg-destructive/10 border-destructive"
                                : "bg-muted/50"
                            }`}
                          >
                            {/* Main Alert Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleAlert(alert.id)}
                                  className="p-1 flex-shrink-0"
                                >
                                  {alert.isActive ? (
                                    <Bell className="w-4 h-4 text-primary" />
                                  ) : (
                                    <BellOff className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm sm:text-base truncate">
                                    {alert.currency} {alert.condition} ₦
                                    {alert.threshold.toLocaleString()}
                                  </p>
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {getRateTypeLabel(alert.rateType)} •{" "}
                                    {alert.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isTriggered && alert.isActive && (
                                  <Badge
                                    variant={
                                      hasBeenTriggered
                                        ? "secondary"
                                        : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {hasBeenTriggered ? "SENT" : "TRIGGERED"}
                                  </Badge>
                                )}
                                <div className="text-right">
                                  <p className="font-mono text-xs sm:text-sm">
                                    ₦{currentRate.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Current
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      info("Testing alert notification...");
                                      handleAlertTriggered(alert, currentRate);
                                    }}
                                    className="text-xs px-2"
                                  >
                                    Test
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteAlert(alert.id)}
                                    className="p-1 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Notification Settings */}
                            <div className="border-t px-3 py-2 bg-background/50">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="text-xs text-muted-foreground">
                                  <strong>Notifications:</strong> Email (always
                                  enabled)
                                </div>
                                {isSupported && (
                                  <div className="flex items-center gap-2">
                                    <label
                                      htmlFor={`push-toggle-${alert.id}`}
                                      className="text-xs font-medium cursor-pointer flex items-center gap-2"
                                    >
                                      <Smartphone className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Push Notifications</span>
                                      <span className="sm:hidden">Push</span>
                                    </label>
                                    <input
                                      id={`push-toggle-${alert.id}`}
                                      type="checkbox"
                                      checked={alert.pushEnabled}
                                      onChange={(e) => {
                                        if (!isSubscribed) {
                                          info(
                                            "Please enable push notifications first",
                                          );
                                          return;
                                        }
                                        updateAlert(alert.id, {
                                          pushEnabled: e.target.checked,
                                        });
                                        success(
                                          e.target.checked
                                            ? "Push notifications enabled"
                                            : "Push notifications disabled",
                                        );
                                      }}
                                      disabled={!isSubscribed}
                                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer"
                                    />
                                  </div>
                                )}
                              </div>
                              {isSupported && !isSubscribed && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                  Enable push notifications above to receive
                                  instant alerts
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <p className="text-xs text-emerald-800 dark:text-emerald-200">
                        <strong>How alerts work:</strong> Create one rate alert
                        and get instant push notifications when triggered. Push
                        notifications are unlimited and instant. Email backup is
                        included (1 per month). The alert resets when the rate
                        moves away from your threshold and can trigger again.
                      </p>
                    </div>
                  </div>
                )}

                {alerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No alerts set up yet</p>
                    <p className="text-sm">
                      Create your first alert above to get notified of rate
                      changes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            {alerts.length === 0 && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Getting Started with Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        📈 For Traders
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Set alerts above and below current rates to catch both
                        buying and selling opportunities.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        💼 For Business
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Monitor remittance rates to know the best time to pay
                        international suppliers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        ✈️ For Travelers
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Get notified when CBN rates drop to exchange currency at
                        better rates.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">⚡ Pro Tip</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Push notifications are the fastest way to get alerts!
                        Enable them above for instant, unlimited notifications
                        delivered directly to your browser.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Educational Section */}
            <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 border-2 border-blue-200 dark:border-blue-800 mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base sm:text-lg">Master Alert Strategies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to set effective exchange rate alerts to maximize
                  your forex decisions:
                </p>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Bell className="w-4 h-4" />
                  <span className="truncate">Read: "How to Set Effective Exchange Rate Alerts"</span>
                </Link>
              </CardContent>
            </Card>

            {/* Monitoring Dashboard */}
            <MonitoringDashboard
              alertStats={getAlertStats()}
              monitoringStats={getMonitoringStats()}
              alertHistory={alertHistory}
              onExportData={exportData}
              onImportData={importData}
              onClearHistory={clearAlertHistory}
              onForceCheck={forceCheck}
              onToggleMonitoring={() => {}} // Monitoring is automatic based on active alerts
            />
          </div>

          {/* Right Sidebar - Skyscraper Ad (160x600) */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0">
            <LazyStickySkyscraperAdWrapper zoneId="10841606" network="adcash" />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  return <AlertsPageContent />;
}
