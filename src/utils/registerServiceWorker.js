// Register service worker for offline support and caching
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    // Handle controller change (new SW ready)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed - new version activated');
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}
