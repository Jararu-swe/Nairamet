"use client";

import { AdcashAd } from "./adcash-ad";

/**
 * AdCash Footer Banner (468x60)
 */
export function AdcashFooterBanner({ zoneId }: { zoneId: string }) {
  return (
    <div className="w-full flex justify-center py-2">
      <AdcashAd 
        zoneId={zoneId} 
        width={468} 
        height={60} 
        title=""
      />
    </div>
  );
}
