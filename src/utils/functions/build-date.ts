import { set } from 'date-fns';

interface SetDateProps {
  date?: string;

  year?: string;
  month?: string;
  day?: string;

  time?: string;
  hours?: string;
  minutes?: string;
}

export const buildDate = (
  baseDate: Date,
  { date, year, month, day, time, hours, minutes }: SetDateProps
): Date => {
  let y: string | undefined = year;
  let m: string | undefined = month;
  let d: string | undefined = day;
  let hor: string | undefined = hours;
  let min: string | undefined = minutes;

  if (time) {
    const [timeHours, timeMinutes] = time.split(':');

    hor = timeHours;
    min = timeMinutes;
  }

  if (date) {
    const [dateYear, dateMonth, dateDay] = date.split('-');

    y = dateYear;
    m = dateMonth;
    d = dateDay;
  }

  return set(baseDate, {
    year: y ? Number(y) : undefined,
    month: m ? Number(m) - 1 : undefined,
    date: d ? Number(d) : undefined,
    hours: hor ? Number(hor) : undefined,
    minutes: min ? Number(min) : undefined,
  });
};
