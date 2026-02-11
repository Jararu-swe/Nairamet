"use client";

import { useEffect, useRef, useState } from "react";

interface AdcashAdProps {
  zoneId: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  title?: string; // Kept for backward compatibility
}

/**
 * Generic AdCash Banner Component
 * Handles checking for aclib and injecting the banner script safely.
 */
export function AdcashAd({
  zoneId,
  width,
  height,
  className = "",
  title = "Advertisement",
}: AdcashAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds (20 * 500ms)
    
    const checkAndInject = () => {
      if (!containerRef.current) return;
      
      // Check if aclib is available
      if ((window as any).aclib && typeof (window as any).aclib.runBanner === 'function') {
        try {
          // Create script element
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.setAttribute('data-adcash', '1');
          // Use the exact format expected by AdCash
          // The script must be executed where the ad should appear
          script.innerHTML = `aclib.runBanner({ zoneId: '${zoneId}' });`;
          
          // Append script to container - AdCash will render inside this div
          // Avoid injecting multiple times
          const alreadyInjected = containerRef.current.querySelector('script[data-adcash="1"]');
          if (!alreadyInjected) {
            containerRef.current.appendChild(script);
          }
          
          console.log(`[Adcash] Injected banner for zone ${zoneId}`);
          setIsLoaded(true);
        } catch (error) {
          console.error(`[Adcash] Error injecting banner for zone ${zoneId}:`, error);
        }
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkAndInject, 500);
        } else {
          console.warn(`[Adcash] Timeout waiting for aclib for zone ${zoneId}`);
          // Fallback: try to inject anyway if aclib is loaded but maybe not detected?
          // Or just leave it empty.
        }
      }
    };

    // Start checking
    // Use a small initial delay to ensure DOM is ready
    setTimeout(checkAndInject, 100);
    
    return () => {
      attempts = maxAttempts; // Stop polling
    };
  }, [zoneId]);

  return (
    <div className={`adcash-ad-container ${className}`}>
      <div className="text-[10px] text-gray-400 text-center mb-1 uppercase tracking-wide">{title}</div>
      <div
        ref={containerRef}
        className="flex justify-center items-center bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors"
        style={{ 
          minHeight: height ? (typeof height === 'number' ? `${height}px` : height) : '90px',
          minWidth: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
          width: '100%'
        }}
      >
        {!isLoaded && (
          <div className="animate-pulse w-full h-full bg-gray-100 dark:bg-gray-800/50" />
        )}
      </div>
    </div>
  );
}
