export const TimeAgo = (postedTime: string): string => {
  const postedDate = new Date(postedTime);
  const currentDate = new Date();

  const elapsed = currentDate.getTime() - postedDate.getTime();
  const seconds = Math.floor(elapsed / 1000);

  const intervals: { [key: string]: number } = {
    y: 31536000,
    mon: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    min: 60,
    sec: 1,
  };

  for (const [interval, secondsInInterval] of Object.entries(intervals)) {
    const value = Math.floor(seconds / secondsInInterval);
    if (value >= 1) {
      return value + interval + " ago";
    }
  }

  return "Just now";
};
