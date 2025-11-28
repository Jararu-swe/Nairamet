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
        <style>{`
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
            overflow: hidden !important;
            font-family: system-ui, -apple-system, sans-serif;
            background: transparent !important;
          }
          /* Hide any navbar or header elements */
          nav, header, .navbar { 
            display: none !important; 
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}