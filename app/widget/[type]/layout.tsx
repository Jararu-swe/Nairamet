import "@/app/globals.css";

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Content Security Policy to block external ad scripts */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-src 'none'; object-src 'none';"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Detect system theme preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                // Check for parent page theme if in iframe
                let parentTheme = null;
                try {
                  if (window.parent !== window) {
                    parentTheme = window.parent.document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                  }
                } catch (e) {
                  // Cross-origin iframe, can't access parent
                }
                // Apply theme
                const theme = parentTheme || (prefersDark ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }

                // Block ad scripts from loading in widget iframe
                // This prevents blog ads from interfering with widget functionality
                if (window.self !== window.top) {
                  // We're in an iframe - block common ad script domains
                  const blockedDomains = [
                    'googlesyndication.com',
                    'doubleclick.net',
                    'adservice.google.com',
                    'monetag.com',
                    'propellerads.com',
                    'popads.net',
                    'adsterra.com',
                    'exoclick.com',
                    'juicyads.com',
                    'trafficjunky.com',
                    'ads.twitter.com',
                    'ads-twitter.com',
                    'facebook.com/tr',
                    'connect.facebook.net',
                    'googletagmanager.com',
                    'analytics.google.com'
                  ];

                  // Override document.write to prevent ad injection
                  document.write = function() {};
                  document.writeln = function() {};

                  // Block script creation for ad domains
                  const originalCreateElement = document.createElement;
                  document.createElement = function(tagName) {
                    const element = originalCreateElement.call(document, tagName);
                    if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
                      const originalSetAttribute = element.setAttribute;
                      element.setAttribute = function(name, value) {
                        if (name === 'src' && typeof value === 'string') {
                          const isBlocked = blockedDomains.some(domain => value.includes(domain));
                          if (isBlocked) {
                            console.log('[Widget] Blocked ad script:', value);
                            return; // Don't set the src
                          }
                        }
                        return originalSetAttribute.call(element, name, value);
                      };
                    }
                    return element;
                  };
                }
              })();
            `,
          }}
        />
        <style>{`
          html, body { 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: hidden !important;
            font-family: system-ui, -apple-system, sans-serif;
            background: transparent !important;
            height: 100% !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
          body > div {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
          /* Hide scrollbars completely */
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          /* Hide any navbar or header elements */
          nav, header, .navbar { 
            display: none !important; 
          }
          /* Block any ad containers that might leak into iframe */
          [class*="ad-"], [id*="ad-"],
          [class*="ads-"], [id*="ads-"],
          [class*="banner"], [id*="banner"],
          [class*="monetag"], [id*="monetag"],
          [class*="adsense"], [id*="adsense"],
          ins.adsbygoogle,
          .adsbygoogle {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
