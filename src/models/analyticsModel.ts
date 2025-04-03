import { PrismaClient, Entry, Tag } from '@prisma/client';

const prisma = new PrismaClient();

const SECONDS_PER_DAY = 86400; // 24 * 60 * 60
const SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY;
export const SECONDS_PER_MONTH = 4.34524 * SECONDS_PER_WEEK;

interface Row {
  label: string;
  value: string;
}

type EntryWithTag = Entry & {
  tag: Tag | null;
};

/**
 * Converts a duration in seconds to a formatted string in HH:MM format.
 *
 * @param seconds - The duration in seconds.
 * @returns A string representing the duration in HH:MM format.
 */
const HHMM = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Sums working hours for entries grouped by a specific time interval.
 *
 * @param entries - The list of entries to process.
 * @param start - The starting timestamp for the interval.
 * @param interval - The duration of each interval in seconds.
 * @param max - The maximum number of intervals to process.
 * @param offset - The UTC offset in seconds.
 * @returns An array of rows containing labels and summed values for each interval.
 */
const sumByInterval = (
  entries: EntryWithTag[],
  start: number,
  interval: number,
  max: number,
  offset: number,
): Row[] => {
  const result: Row[] = [];
  let currentEntries = [...entries];
  let currentStart = start;
  let cutOff = max;

  while (entries.length > 0 && cutOff > 0) {
    // Get entries within the current interval
    const entriesInInterval = currentEntries.filter(
      (entry) => entry.startTimeUtc >= currentStart,
    );

    // Sum working hours in the interval
    result.push({
      label: new Date(currentStart * 1000 - offset * 1000).toUTCString(),
      value: HHMM(
        entriesInInterval.reduce(
          (prev, curr) => prev + (curr.endTimeUtc - curr.startTimeUtc),
          0,
        ),
      ),
    });

    // Remove entries from the current interval
    currentEntries = entries.filter(
      (entry) => entry.startTimeUtc < currentStart,
    );

    currentStart -= interval;
    cutOff--;
  }

  return result;
};

/**
 * Groups entries by tags and calculates the total working hours for each tag.
 *
 * @param entries - The list of entries to process.
 * @returns An array of rows containing tag names and their corresponding working hours.
 */
const getTagsWithWorkingHours = (entries: EntryWithTag[]): Row[] => {
  const tagGroups = new Map<
    number,
    {
      name: string;
      color: string | null;
      totalSeconds: number;
    }
  >();

  for (const entry of entries) {
    if (!entry.tag) continue;

    const tagId = entry.tagId;
    const workingTime = entry.endTimeUtc - entry.startTimeUtc;

    if (tagGroups.has(tagId)) {
      const tagInfo = tagGroups.get(tagId)!;
      tagInfo.totalSeconds += workingTime;
    } else {
      tagGroups.set(tagId, {
        name: entry.tag.name,
        color: entry.tag.color,
        totalSeconds: workingTime,
      });
    }
  }

  // Convert to array and sort by total seconds descending
  const result = Array.from(tagGroups.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    hours: HHMM(data.totalSeconds),
    totalSeconds: data.totalSeconds,
  }));

  return result
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
    .map((entry) => ({ label: entry.name, value: entry.hours }));
};

/**
 * Retrieves analytics data for a user, including daily, weekly, monthly, and tag-based summaries.
 *
 * @param userId - The ID of the user for whom analytics data is being retrieved.
 * @param utcOffset - The UTC offset in seconds.
 * @returns An object containing analytics data grouped by day, week, month, and tags.
 */
export async function getAnalyticsData(userId: number, utcOffset: number) {
  // Fetch entries including their associated tag
  const entries = await prisma.entry.findMany({
    where: { userId },
    include: { tag: true },
    orderBy: { startTimeUtc: 'desc' },
  });

  // Get current time in unix epoch seconds (UTC)
  const nowInSeconds = Math.floor(Date.now() / 1000);

  // Calculate start times for day, week, and month intervals
  const currentDayOfWeek = new Date().getDay();
  const daysWeekSubtract = (currentDayOfWeek + 6) % 7;
  const daysMonthSubtract = new Date().getDay();

  const dayStart = nowInSeconds - (nowInSeconds % SECONDS_PER_DAY) + utcOffset;

  const weekStart =
    nowInSeconds -
    (nowInSeconds % SECONDS_PER_DAY) -
    daysWeekSubtract * SECONDS_PER_DAY +
    utcOffset;

  const monthStart =
    nowInSeconds -
    (nowInSeconds % SECONDS_PER_DAY) -
    daysMonthSubtract * SECONDS_PER_DAY +
    utcOffset;

  // Calculate daily, weekly, and monthly summaries
  let daysSum = sumByInterval(
    entries,
    dayStart,
    SECONDS_PER_DAY,
    14,
    utcOffset,
  );
  daysSum = daysSum.map((row) => ({
    value: row.value,
    label: row.label.split(',')[0],
  }));

  let weeksSum = sumByInterval(
    entries,
    weekStart,
    SECONDS_PER_WEEK,
    52,
    utcOffset,
  );
  weeksSum = weeksSum.map((row) => ({
    value: row.value,
    label: `${row.label.split(' ')[1]}. ${row.label.split(' ')[2]}`,
  }));

  let monthsSum = sumByInterval(
    entries,
    monthStart,
    SECONDS_PER_MONTH,
    12,
    utcOffset,
  );
  monthsSum = monthsSum.map((row) => ({
    value: row.value,
    label: `${row.label.split(' ')[2]}. ${row.label.split(' ')[3]}`,
  }));

  // Calculate tag-based summaries
  const tagsSummary = getTagsWithWorkingHours(entries);

  return {
    day: daysSum,
    month: monthsSum,
    week: weeksSum,
    tags: tagsSummary,
  };
}
