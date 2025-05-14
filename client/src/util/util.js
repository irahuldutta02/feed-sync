import { format, parseISO } from "date-fns";
import { TZDate } from "@date-fns/tz";

export const formatDateTime = (dateString) => {
  const timeZone = "Asia/Kolkata";
  const date = parseISO(dateString);
  const tzDate = new TZDate(date, timeZone);

  return format(tzDate, "dd-MM-yyyy hh:mm a");
};
