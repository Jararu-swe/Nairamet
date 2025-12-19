import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Rate Logs"
      description="Search and export historical rate logs for Naira exchange data. Filter by date and currency, and download CSV or PDF."
      keywords={["rate logs", "historical rates", "export rates", "naira logs"]}
      url={`${process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"}/logs`}
    />
  );
}
