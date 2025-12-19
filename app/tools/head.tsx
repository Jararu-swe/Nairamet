import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Widgets & Tools"
      description="Embeddable widgets, calculators, and FX tools to help you monitor and convert Naira rates in real-time."
      keywords={["widgets", "fx tools", "currency widgets", "naira tools"]}
      url={`${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/tools`}
    />
  );
}
