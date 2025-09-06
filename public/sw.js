self.addEventListener("push", (event) => {
  console.log("[SW] Push received:", event)

  if (event.data) {
    const data = event.data.json()
    console.log("[SW] Push data:", data)

    const options = {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || "1",
        url: data.url || "/",
      },
      actions: [
        {
          action: "view-rates",
          title: "View Rates",
          icon: "/icon-view.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon-close.png",
        },
      ],
      requireInteraction: true,
      tag: "fx-alert",
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click received:", event)

  event.notification.close()

  if (event.action === "view-rates") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"))
  } else if (event.action === "close") {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"))
  }
})

self.addEventListener("install", (event) => {
  console.log("[SW] Service worker installing...")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Service worker activating...")
  event.waitUntil(self.clients.claim())
})
