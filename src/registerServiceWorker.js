// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found!');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('📦 New content available; please refresh.');
              // You can show a "Update available" toast here
            }
          });
        });
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

// Check if app is online/offline
export function checkOnlineStatus() {
  return navigator.onLine;
}

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('🌐 App is online');
  // You can trigger a model refresh here if needed
});

window.addEventListener('offline', () => {
  console.log('📶 App is offline');
});