const DISPLAY_TIMEZONE = "Africa/Kigali";

export function formatDateTime(value: string | undefined | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: DISPLAY_TIMEZONE,
  });

  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: DISPLAY_TIMEZONE,
  });

  return `${datePart} ${timePart}`;
}
