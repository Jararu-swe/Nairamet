import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Live Exchange Rates"
      description="Real-time USD/NGN, GBP/NGN, EUR/NGN and more — CBN, black market and parallel market rates with live updates and converters."
      keywords={[
        "live rates",
        "USD to NGN",
        "naira",
        "exchange rates",
        "currency converter",
      ]}
      url={`${
        process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"
      }/tracker`}
    />
  );
}
