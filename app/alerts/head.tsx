import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Rate Alerts"
      description="Set up smart rate alerts and get notified when exchange rates reach your target thresholds. Email and push notifications supported."
      keywords={[
        "rate alerts",
        "currency alerts",
        "naira alerts",
        "exchange alerts",
      ]}
      url={`${
        process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"
      }/alerts`}
    />
  );
}
