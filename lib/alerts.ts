import { UserStorage } from "@/lib/user-storage";

export type RateAlertParams = {
  currency: string;
  rateType: "official" | "black_market" | "remittance";
  condition: "above" | "below";
  threshold: number;
  isActive?: boolean;
};

/**
 * Create a rate alert and optionally attach a custom data payload.
 * Uses UserStorage under the hood to persist per-user alerts.
 */
export function rateAlert(params: RateAlertParams, data?: Record<string, any>) {
  // Will throw if user is not logged in (per UserStorage.saveAlert requirements)
  return UserStorage.rateAlert(params, data);
}