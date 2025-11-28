import { v4 } from 'uuid';

export interface AnnouncementTimer {
  visible: boolean;
  startedAt: number;
  length: number;
  timerEndsAction: 'removeAnnouncement' | 'removeTimer' | 'nothing';
}

export class Announcement {
  public readonly id: string;
  public message: string;
  public timer: AnnouncementTimer | null;

  public constructor(message: string, timer?: AnnouncementTimer) {
    this.id = v4();
    this.message = message;
    this.timer = timer ?? null;
  }
}
