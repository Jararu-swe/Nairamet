import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Historical Charts"
      description="Interactive historical charts for Naira exchange rates. Compare CBN vs black market and analyze trends over time."
      keywords={[
        "naira charts",
        "historical rates",
        "forex charts",
        "exchange rate charts",
      ]}
      url={`${
        process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"
      }/charts`}
    />
  );
}
