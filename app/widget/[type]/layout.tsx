import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            height: 100%;
            width: 100%;
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
        `}</style>
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}