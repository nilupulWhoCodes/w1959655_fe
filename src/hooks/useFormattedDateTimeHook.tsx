import { useMemo } from "react";

type UseFormattedDateTimeOptions = {
  locale?: string;
  dateOptions?: Intl.DateTimeFormatOptions;
  timeOptions?: Intl.DateTimeFormatOptions;
};

export const useFormattedDateTime = (
  date: Date | string,
  options?: UseFormattedDateTimeOptions
) => {
  const {
    locale = "en-US",
    dateOptions = { year: "numeric", month: "short", day: "numeric" },
    timeOptions = { hour: "2-digit", minute: "2-digit" },
  } = options || {};

  const formattedDateTime = useMemo(() => {
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toLocaleDateString(locale, dateOptions);
    const formattedTime = parsedDate.toLocaleTimeString(locale, timeOptions);

    return { formattedDate, formattedTime };
  }, [date, locale, dateOptions, timeOptions]);

  return formattedDateTime;
};
