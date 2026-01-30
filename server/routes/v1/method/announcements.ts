import { replicants } from '~/utils/replicants';
import type { AnnouncementTimer } from '~/utils/announcement';
import { Announcement } from '~/utils/announcement';

// Utility: Convert ms to clock string
function millisToString(time: number) {
  if (Math.abs(time) < 60000) {
    const seconds = Math.floor((time % 60000) / 1000).toString(10).padStart(2, '0');
    const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
    return `${seconds}.${millis}`;
  }
  else {
    const minutes = Math.floor(time / 60000).toString(10).padStart(2, '0');
    const seconds = Math.floor(Math.abs(time % 60000) / 1000).toString(10).padStart(2, '0');
    const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
    return `${minutes}:${seconds}.${millis}`;
  }
}

// Announcement parameter maps
const announcement_global_param1 = {
  '4on4': '4 on 4',
  '3on3': '3 on 3',
  '3on5': '3 on 5',
  '5on3': '5 on 3',
  'timeout': 'Timeout',
  'empty_net': 'Empty Net',
  'official_review': 'Official Review',
  'delayed_penalty': 'Delayed Penalty',
  'flag': 'Flag',
  'pur': 'Play Under Review',
};
const announcement_teamSpecific_param2 = {
  'delayed_penalty': { name: 'Delayed Penalty', time: null },
  'power_play_2': { name: 'Power Play', time: 2 * 60 * 1000 },
  'power_play_5': { name: 'Power Play', time: 5 * 60 * 1000 },
  'pp_2': { name: 'PP', time: 2 * 60 * 1000 },
  'pp_5': { name: 'PP', time: 5 * 60 * 1000 },
  'man_up_0.5': { name: 'Man Up', time: 30 * 1000 },
  'man_up_1': { name: 'Man Up', time: 60 * 1000 },
  'man_up_2': { name: 'Man Up', time: 2 * 60 * 1000 },
};

// Utility: Add announcement
function addAnnouncement(type: 'global' | 'home' | 'away', messageInput: string, timerInput: number | null, top = false) {
  const announcementTimer: AnnouncementTimer | null = timerInput
    ? {
        visible: true,
        startedAt: replicants.scoreboard.clock.time,
        length: timerInput,
        timerEndsAction: 'removeAnnouncement',
      }
    : null;

  let announcements: { announcement: Announcement[] } = replicants.scoreboard;

  if (type === 'home')
    announcements = replicants.scoreboard.homeTeam;
  else if (type === 'away')
    announcements = replicants.scoreboard.awayTeam;

  const newAnnouncement = new Announcement(messageInput, announcementTimer ?? undefined);
  if (top) {
    announcements.announcement = [newAnnouncement, ...announcements.announcement];
  }
  else {
    announcements.announcement = [...announcements.announcement, newAnnouncement];
  }
  return { code: 200, msg: `created announcement '${messageInput}'` };
}

// Utility: Remove one announcement
function removeOneAnnouncement(type: 'global' | 'team1' | 'team2', bottom = false) {
  if (type.length === 0) {
    return { code: 200, msg: 'there are no messages to remove here' };
  }
  let announcements: { announcement: Announcement[] } = replicants.scoreboard;
  if (type === 'team1')
    announcements = replicants.scoreboard.homeTeam;
  else if (type === 'team2')
    announcements = replicants.scoreboard.awayTeam;

  const removed = announcements.announcement[bottom ? (type.length - 1) : 0];
  if (bottom) {
    announcements.announcement = announcements.announcement.filter((_, idx) => idx !== type.length - 1);
  }
  else {
    announcements.announcement = announcements.announcement.filter((_, idx) => idx !== 0);
  }
  return {
    code: 200,
    msg: `removed announcement ${removed.message} w/ ${removed.timer ? `${millisToString(removed.timer.length)} left` : '\'NO TIME SPECIFIED\''}'`,
    data: removed,
  };
}

// Endpoint handlers
function teamSpecific(params: any) {
  const { param1, param2, param3 } = params;
  if (!param1) return { code: 400, msg: 'missing destination team (team1 | team2)' };
  if (!param2) return { code: 400, msg: `missing message to display on team: '${param1}'` };
  if (!announcement_teamSpecific_param2[param2 as keyof typeof announcement_teamSpecific_param2]) return { code: 400, msg: `'${param2}' is an invalid message to display on team: '${param1}'` };
  const top = param3 === 'top';
  const selected = announcement_teamSpecific_param2[param2 as keyof typeof announcement_teamSpecific_param2];
  if (param1 === 'team1') {
    return addAnnouncement('home', selected.name, selected.time, top);
  }
  else if (param1 === 'team2') {
    return addAnnouncement('away', selected.name, selected.time, top);
  }
  else {
    return { code: 400, msg: `invalid team '${param1}'` };
  }
}
function handleGlobal(params: any) {
  const { param1, param2 } = params;
  if (!param1) return { code: 400, msg: 'missing global message parameter' };
  const bottom = param2 === 'bottom';
  if (announcement_global_param1[param1 as keyof typeof announcement_global_param1]) {
    return addAnnouncement('global', announcement_global_param1[param1 as keyof typeof announcement_global_param1], null, !bottom);
  }
  else {
    return { code: 400, msg: `invalid global announcement param: '${param1}'` };
  }
}
function handleRemove(params: any) {
  const { param1, param2 } = params;
  if (!param1) return { code: 400, msg: 'missing announcement type to remove announcement from (global | team1 | team2)' };
  const announcement_handleRemove_param1 = {
    global: replicants.scoreboard,
    team1: replicants.scoreboard.homeTeam,
    team2: replicants.scoreboard.awayTeam,
  };
  if (announcement_handleRemove_param1[param1 as keyof typeof announcement_handleRemove_param1].announcement) {
    if (param2 === 'all') {
      announcement_handleRemove_param1[param1 as keyof typeof announcement_handleRemove_param1].announcement = [];
      return { code: 200, msg: `removed all controllable messages` };
    }
    else {
      const bottom = param2 === 'bottom';
      return removeOneAnnouncement(param1 as 'global' | 'team1' | 'team2', bottom);
    }
  }
  else {
    return { code: 400, msg: `invalid announcement type: ${param1}` };
  }
}

const endpointsAnnouncements = {
  team_specific: teamSpecific,
  global: handleGlobal,
  remove: handleRemove,
};

// Main Nuxt API handler
export default async function announcements(event: any, paramsArr: string[]) {
  const [endpoint, ...rest] = paramsArr;
  const params: Record<string, string> = {};
  rest.forEach((val, idx) => params[`param${idx + 1}`] = val);

  if (!endpointsAnnouncements[endpoint as keyof typeof endpointsAnnouncements]) {
    return { statusCode: 400, body: { code: 400, msg: `invalid endpoint in announcements '${endpoint}'` } };
  }
  const result = endpointsAnnouncements[endpoint as keyof typeof endpointsAnnouncements](params);
  return { statusCode: result.code, body: result };
}
