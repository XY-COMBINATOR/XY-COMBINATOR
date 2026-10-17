import { useEffect, useState } from 'react';

function Time() {
  const formatTime = () => new Intl.DateTimeFormat('el-GR', { hour12: false, hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState(formatTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(formatTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <span>{time}</span>;
}

export default Time;
