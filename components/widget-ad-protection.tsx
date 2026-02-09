"use client";

import { useEffect } from 'react';

/**
 * Widget Ad Protection Component
 * 
 * This component provides comprehensive protection against blog ads
 * interfering with widget functionality when widgets are embedded
 * in iframes on external sites or within the blog pages.
 */
export function WidgetAdProtection() {
  useEffect(() => {
    // Only run protection if we're in an iframe (widget context)
    if (window.self === window.top) return;

    console.log('[Widget Protection] Initializing ad protection for widget iframe');

    // List of ad networks and tracking domains to block
    const blockedDomains = [
      // Google Ads
      'googlesyndication.com',
      'doubleclick.net',
      'adservice.google.com',
      'googletagmanager.com',
      'analytics.google.com',
      
      // Monetag (our blog ads)
      'monetag.com',
      'propellerads.com',
      'popads.net',
      
      // AdCash (our blog ads)
      'acscdn.com',
      'adcash.com',
      
      // Other common ad networks
      'adsterra.com',
      'exoclick.com',
      'juicyads.com',
      'trafficjunky.com',
      'bidvertiser.com',
      
      // Social media tracking
      'ads.twitter.com',
      'ads-twitter.com',
      'facebook.com/tr',
      'connect.facebook.net',
      
      // OneSignal (push notifications)
      'cdn.onesignal.com',
      'onesignal.com'
    ];

    // Block global ad variables
    const blockedGlobals = ['aclib', 'OneSignal', 'googletag', 'adsbygoogle'];
    
    blockedGlobals.forEach(globalVar => {
      try {
        Object.defineProperty(window, globalVar, {
          get: () => {
            console.log(`[Widget Protection] Blocked access to ${globalVar}`);
            return undefined;
          },
          set: () => {
            console.log(`[Widget Protection] Blocked setting ${globalVar}`);
          },
          configurable: false
        });
      } catch (e) {
        // Property might already be defined, try to override
        try {
          (window as any)[globalVar] = undefined;
        } catch (e2) {
          console.log(`[Widget Protection] Could not block ${globalVar}:`, e2);
        }
      }
    });

    // Override document methods that ads use for injection
    const originalWrite = document.write;
    const originalWriteln = document.writeln;
    
    document.write = function(...args) {
      console.log('[Widget Protection] Blocked document.write:', args);
      return;
    };
    
    document.writeln = function(...args) {
      console.log('[Widget Protection] Blocked document.writeln:', args);
      return;
    };

    // Block dynamic script/iframe creation for ad domains
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'iframe') {
        const originalSetAttribute = element.setAttribute;
        const originalSetSrc = Object.getOwnPropertyDescriptor(element.constructor.prototype, 'src')?.set;
        
        // Override setAttribute
        element.setAttribute = function(name, value) {
          if (name === 'src' && typeof value === 'string') {
            const isBlocked = blockedDomains.some(domain => value.includes(domain));
            if (isBlocked) {
              console.log('[Widget Protection] Blocked element src via setAttribute:', value);
              return;
            }
          }
          return originalSetAttribute.call(element, name, value);
        };
        
        // Override src property setter
        if (originalSetSrc) {
          Object.defineProperty(element, 'src', {
            get: function() {
              return this.getAttribute('src') || '';
            },
            set: function(value) {
              if (typeof value === 'string') {
                const isBlocked = blockedDomains.some(domain => value.includes(domain));
                if (isBlocked) {
                  console.log('[Widget Protection] Blocked element src via property:', value);
                  return;
                }
              }
              return originalSetSrc.call(this, value);
            }
          });
        }
      }
      
      return element;
    };

    // Block fetch requests to ad domains
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : 
                  typeof input === 'object' && input ? input.url : '';
      
      if (url) {
        const isBlocked = blockedDomains.some(domain => url.includes(domain));
        if (isBlocked) {
          console.log('[Widget Protection] Blocked fetch request:', url);
          return Promise.reject(new Error('Request blocked by widget protection'));
        }
      }
      
      return originalFetch.call(window, input, init);
    };

    // Block XMLHttpRequest to ad domains
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (typeof url === 'string') {
        const isBlocked = blockedDomains.some(domain => url.includes(domain));
        if (isBlocked) {
          console.log('[Widget Protection] Blocked XHR request:', url);
          // Don't call the original open method
          return;
        }
      }
      return originalXHROpen.call(this, method, url, ...args);
    };

    // Block appendChild for ad elements
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
      if (child && child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        const tagName = element.tagName?.toLowerCase();
        
        if (tagName === 'script' || tagName === 'iframe') {
          const src = element.getAttribute('src') || '';
          const isBlocked = blockedDomains.some(domain => src.includes(domain));
          
          if (isBlocked) {
            console.log('[Widget Protection] Blocked appendChild for ad element:', src);
            return child; // Return the child but don't actually append it
          }
        }
        
        // Check for ad-related class names or IDs
        const className = element.className || '';
        const id = element.id || '';
        const isAdElement = /ad|banner|monetag|adcash|adsense/i.test(className + ' ' + id);
        
        if (isAdElement) {
          console.log('[Widget Protection] Blocked ad element appendChild:', className, id);
          return child;
        }
      }
      
      return originalAppendChild.call(this, child);
    };

    // Block insertBefore for ad elements
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
      if (newNode && newNode.nodeType === Node.ELEMENT_NODE) {
        const element = newNode as Element;
        const tagName = element.tagName?.toLowerCase();
        
        if (tagName === 'script' || tagName === 'iframe') {
          const src = element.getAttribute('src') || '';
          const isBlocked = blockedDomains.some(domain => src.includes(domain));
          
          if (isBlocked) {
            console.log('[Widget Protection] Blocked insertBefore for ad element:', src);
            return newNode;
          }
        }
      }
      
      return originalInsertBefore.call(this, newNode, referenceNode);
    };

    // Remove any existing ad elements from the DOM
    const removeAdElements = () => {
      const adSelectors = [
        '[class*="ad-"]', '[id*="ad-"]',
        '[class*="ads-"]', '[id*="ads-"]',
        '[class*="banner"]', '[id*="banner"]',
        '[class*="monetag"]', '[id*="monetag"]',
        '[class*="adcash"]', '[id*="adcash"]',
        '[class*="adsense"]', '[id*="adsense"]',
        'ins.adsbygoogle', '.adsbygoogle',
        'iframe[src*="monetag"]',
        'iframe[src*="adcash"]',
        'iframe[src*="googlesyndication"]',
        'script[src*="monetag"]',
        'script[src*="adcash"]',
        'script[src*="acscdn"]'
      ];
      
      adSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            console.log('[Widget Protection] Removing ad element:', element);
            element.remove();
          });
        } catch (e) {
          // Ignore selector errors
        }
      });
    };

    // Initial cleanup
    removeAdElements();

    // Set up mutation observer to catch dynamically added ad elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const tagName = element.tagName?.toLowerCase();
            const className = element.className || '';
            const id = element.id || '';
            
            // Check if it's an ad element
            const isAdElement = /ad|banner|monetag|adcash|adsense/i.test(className + ' ' + id) ||
                               (tagName === 'script' && element.getAttribute('src')?.match(/monetag|adcash|acscdn/)) ||
                               (tagName === 'iframe' && element.getAttribute('src')?.match(/monetag|adcash|googlesyndication/));
            
            if (isAdElement) {
              console.log('[Widget Protection] Mutation observer removing ad element:', element);
              element.remove();
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Periodic cleanup (in case some ads slip through)
    const cleanupInterval = setInterval(removeAdElements, 2000);

    // Cleanup function
    return () => {
      observer.disconnect();
      clearInterval(cleanupInterval);
      
      // Restore original methods (though this rarely happens in practice)
      document.write = originalWrite;
      document.writeln = originalWriteln;
      document.createElement = originalCreateElement;
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
      Node.prototype.appendChild = originalAppendChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);

  return null; // This component doesn't render anything
}