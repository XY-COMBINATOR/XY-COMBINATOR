/**
 * Time Component
 * Displays real-time studio clock updated every second with clean UTC/Local time formatting.
 */
import { useEffect, useState } from 'react';

/**
 * Returns formatted 24-hour time string (HH:MM:SS) using the user's localized time.
 */
const getFormattedTime = () => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
  } catch {
    // Fallback if Intl is unavailable
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  }
};

function Time() {
  // Use lazy state initialization to maintain purity during the initial render pass
  const [time, setTime] = useState(() => getFormattedTime());

  useEffect(() => {
    // Update every second for live accurate time representation
    const intervalId = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <span aria-label={`Current studio time: ${time}`}>{time}</span>;
}

export default Time;
