import { useEffect, useState } from "react";
import { formatUpdatedText } from "../utils/formatters";

/**
 * Custom hook that updates every 10 seconds to display fresh relative time strings.
 *
 * @param {Date|string|number} timestamp
 * @returns {string|null} Formatted relative time (e.g., "Just now", "2 min ago")
 */
export function useUpdatedTime(timestamp) {
  const [, setNow] = useState(Date.now());

  useEffect(() => {
    if (!timestamp) return;

    const interval = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return timestamp ? formatUpdatedText(timestamp) : null;
}

export default useUpdatedTime;

