import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const getCurrentTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDate = (dateString: string, timeZone: string): string => {
  const date = new Date(dateString);
  const kolkataDate = toZonedTime(date, timeZone);
  return format(kolkataDate, "MMM d, yyyy");
};
