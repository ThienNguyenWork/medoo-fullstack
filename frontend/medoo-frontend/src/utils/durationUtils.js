/* utils/durationUtils.js */
export function parseDuration(str = "") {
    const match = str.match(/(?:(\d+)h)?\s*(?:(\d+)p)?/) || [];
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const mins = match[2] ? parseInt(match[2], 10) : 0;
    return hours * 60 + mins;
  }
  
  export function formatDuration(totalMins) {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h > 0 ? h + "h" : ""}${m > 0 ? m + "p" : ""}` || "0p";
  }
  