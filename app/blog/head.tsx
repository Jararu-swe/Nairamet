import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Naira Watch - Blog"
      description="News, analysis, and commentary about Nigeria's FX markets — policy updates, market summaries, and education."
      keywords={["naira blog", "fx news", "naira analysis", "currency blog"]}
      url={`${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/blog`}
    />
  );
}
