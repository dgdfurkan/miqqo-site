import { site, dayNames } from '../data/site';

type Hours = (typeof site.hours)[number];

export type OpenStatus =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string; when: 'bugün' | 'yarın' };

const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function hoursFor(day: number): Hours {
  return site.hours.find((h) => h.day === day)!;
}

// Kapanış açılıştan küçük veya eşitse kapanış ertesi güne düşer (07:00-02:00 gibi).
function spillsOver(h: Hours): boolean {
  return toMinutes(h.close) <= toMinutes(h.open);
}

export function istanbulNow(date = new Date()): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return { day: weekdayIndex[get('weekday')], minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function openStatus(date = new Date()): OpenStatus {
  const { day, minutes } = istanbulNow(date);
  const yesterday = hoursFor((day + 6) % 7);
  if (spillsOver(yesterday) && minutes < toMinutes(yesterday.close)) {
    return { open: true, closesAt: yesterday.close };
  }

  const today = hoursFor(day);
  const opens = toMinutes(today.open);
  const closes = toMinutes(today.close);
  const openNow = spillsOver(today) ? minutes >= opens : minutes >= opens && minutes < closes;
  if (openNow) return { open: true, closesAt: today.close };
  if (minutes < opens) return { open: false, opensAt: today.open, when: 'bugün' };
  return { open: false, opensAt: hoursFor((day + 1) % 7).open, when: 'yarın' };
}

export function statusText(status: OpenStatus): { label: string; detail: string } {
  return status.open
    ? { label: 'Şu an açık', detail: `Kapanış ${status.closesAt}` }
    : { label: 'Şu an kapalı', detail: `${status.when === 'bugün' ? 'Açılış' : 'Yarın açılış'} ${status.opensAt}` };
}

// Aynı saatleri paylaşan günleri gruplar: "Pazartesi - Cumartesi 07:00 - 02:00".
export function groupedHours(): { days: string; time: string }[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { from: number; to: number; time: string }[] = [];
  for (const day of order) {
    const h = hoursFor(day);
    const time = `${h.open} - ${h.close}`;
    const last = groups.at(-1);
    if (last && last.time === time) last.to = day;
    else groups.push({ from: day, to: day, time });
  }
  return groups.map((g) => ({
    days: g.from === g.to ? dayNames[g.from] : `${dayNames[g.from]} - ${dayNames[g.to]}`,
    time: g.time,
  }));
}
