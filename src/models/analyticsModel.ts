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

const HHMM = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

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
    // get values greater than current start
    const entriesInInterval = currentEntries.filter(
      (entry) => entry.startTimeUtc >= currentStart,
    );

    // sum working hours in interval
    result.push({
      label: new Date(currentStart * 1000 - offset * 1000).toUTCString(), // TODO offset
      value: HHMM(
        entriesInInterval.reduce(
          (prev, curr) => prev + (curr.endTimeUtc - curr.startTimeUtc),
          0,
        ),
      ),
    });

    // remove entries from current interval
    currentEntries = entries.filter(
      (entry) => entry.startTimeUtc < currentStart,
    );

    currentStart -= interval;
    cutOff--;
  }

  return result;
};

const getTagsWithWorkingHours = (entries: EntryWithTag[]): Row[] => {
  // Group entries by tagId
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

export async function getAnalyticsData(userId: number, utcOffset: number) {
  // Fetch entries including their associated tag
  const entries = await prisma.entry.findMany({
    where: { userId },
    include: { tag: true },
    orderBy: { startTimeUtc: 'desc' },
  });

  // Get current time in unix epoch seconds (UTC)
  const nowInSeconds = Math.floor(Date.now() / 1000);

  // start of the week should be monday (0 is sunday)
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

  const tagsSummary = getTagsWithWorkingHours(entries);

  return {
    day: daysSum,
    month: monthsSum,
    week: weeksSum,
    tags: tagsSummary,
  };
}
