import { useState, useEffect, useCallback } from 'react';

export function useLiveFeed(url: string) {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to live feed');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'ENV_UPDATE') {
          setData(msg.payload);
        }
      } catch (e) {
        console.error('Error parsing live feed message:', e);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from live feed, retrying in 5s...');
      setIsConnected(false);
      setTimeout(connect, 5000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close();
    };

    return ws;
  }, [url]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.onclose = null; // prevent reconnect on unmount
      ws.close();
    };
  }, [connect]);

  return { data, isConnected };
}
