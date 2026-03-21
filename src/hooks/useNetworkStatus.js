import { useState, useEffect } from 'react';

/**
 * Hook to detect network conditions and connection quality
 * Returns connection info including effective type, downlink speed, and latency
 */
export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: navigator.onLine,
    isSlowNetwork: false,
    effectiveType: '4g', // 4g, 3g, 2g, slow-2g
    downlink: null,
    latency: null,
  });

  useEffect(() => {
    // Check Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const updateNetworkStatus = () => {
      const isSlowNetwork =
        !navigator.onLine ||
        (connection && ['2g', 'slow-2g'].includes(connection.effectiveType));

      setNetworkStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        isSlowNetwork,
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || null,
        latency: connection?.rtt || null,
      }));
    };

    // Initial check
    updateNetworkStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Listen for connection changes (Network Information API)
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
}
