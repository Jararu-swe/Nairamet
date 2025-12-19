import React from "react";
import { MetaTags } from "@/lib/seo";

export default function Head() {
  return (
    <MetaTags
      title="Privacy Policy"
      description="NairaMet privacy policy — how we collect, use, and protect your data. Learn about cookies, analytics, and advertising preferences."
      keywords={[
        "privacy policy",
        "cookies",
        "data protection",
        "nairamet privacy",
      ]}
      url={`${
        process.env.NEXT_PUBLIC_APP_URL || "https://nairamet.com"
      }/privacy`}
    />
  );
}
