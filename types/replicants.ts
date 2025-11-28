import type { Announcement } from '~/utils/announcement';
import type { StandingsTeam } from '~/utils/standings';
import { v4 } from 'uuid';

export const defaultLowerThird = {
  bottomTextBar: {
    greyText: {
      text: '',
      alignment: 'center' as 'left' | 'center' | 'right',
      textSize: 0,
      offsetX: 0,
      offsetY: 0,
      textColor: '#FFFFFF',
      bgColor: '#000000',
    },
    redText: {
      text: '',
      alignment: 'center' as 'left' | 'center' | 'right',
      textSize: 0,
      offsetX: 0,
      offsetY: 0,
      textColor: '#FFFFFF',
      autoResize: false,
    },
  },
  bug: {
    offsetX: 0,
    offsetY: 0,
  },
  commentators: {
    offsetX: 0,
    offsetY: 0,
    people: [] as Commentator[],
  },
  copyright: {
    offsetX: 0,
    offsetY: 0,
    text: `©${new Date().getFullYear()} RPI TV`,
    textColor: '',
    textSize: 0,
  },
  endGraphics: {
    disabled: false,
    title: 'RPI TV Crew',
    message: 'Director\nProducer\nReplay Operator\nCamera Operator',
    length: 30,
    type: 'box' as 'scroll' | 'box',
  },
  goToBreak: {
    offsetX: 0,
    offsetY: 0,
    description: {
      clock: false,
      fontSize: 0,
      fontColor: '',
      text: '',
      autoFit: false,
    },
    awayTeam: {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 100,
      logoColor: '',
      score: 0,
      scoreColor: '',
      scoreSize: 0,
      primaryColor: '',
      secondaryColor: '',
    },
    homeTeam: {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 100,
      logoColor: '',
      score: 0,
      scoreColor: '',
      scoreSize: 0,
      primaryColor: '',
      secondaryColor: '',
    },
    // Swaps the default team positions
    teamSwap: false,
  },
  locator: {
    offsetX: 0,
    offsetY: 0,
    awayTeam: {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 100,
      logoColor: '',
      primaryColor: '',
      secondaryColor: '',
    },
    homeTeam: {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 100,
      logoColor: '',
      primaryColor: '',
      secondaryColor: '',
    },
    location: {
      name: '',
      nameColor: '',
      nameSize: 0,
    },
    // Swaps the default team positions
    teamSwap: false,
  },
  playerBio: {
    description: '',
    fontSize: 0,
    playerName: '',
    playerNumber: '',
    playerColor: '',
    imageURL: '',
    position: '',
    teamside: 'awayTeam' as 'awayTeam' | 'homeTeam',
    offsetX: 0,
    offsetY: 0,
    info: {
      show: false,
      height: '',
      year: '',
      weight: '',
      hometown: '',
    },
  },
};

export class Commentator {
  public _id: string;
  public name: string;
  public nameColor: string;
  public nameSize: number;
  public description: string;
  public descriptionColor: string;
  public descriptionSize: number;
  public constructor(name = '', nameColor = '', nameSize = 0, description = '', descriptionColor = '', descriptionSize = 0) {
    this._id = v4();
    this.name = name;
    this.nameColor = nameColor;
    this.nameSize = nameSize;
    this.description = description;
    this.descriptionColor = descriptionColor;
    this.descriptionSize = descriptionSize;
  }
}

export const defaultConfiguration = {
  style: 'rpitv' as 'rpitv' | 'espn' | 'football',
  // Based on the selected sport, it will attempt to fetch different data from athletics.
  sport: 'hockey' as 'hockey' | 'football' | 'acha' | 'lacrosse' | 'basketball' | 'soccer',
  type: 'men' as 'men' | 'women',
  awayTeam: {
    // The abbreviation of the school, typically 3-5 characters.
    abbr: '',
    // The short name of the team with a max of 14 characters.
    shortName: '',
    // The full name of the school.
    schoolName: '',
    // The full name of the team. Ex: RPI Engineers
    teamName: '',
    logo: '',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    // :)
    special: false,
    athletics: '',
  },
  homeTeam: {
    // The abbreviation of the school, typically 3-5 characters.
    abbr: '',
    // The short name of the team with a max of 14 characters.
    shortName: '',
    // The full name of the school.
    schoolName: '',
    // The full name of the team. Ex: RPI Engineers
    teamName: '',
    logo: '',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    // :)
    special: false,
    athletics: '',
  },
  sync: {
    daktronics: {
      availablePorts: [] as string[],
      feed: 'tv' as 'tv' | 'rtd',
      status: {
        bitrate: 0,
        error: false,
        errorMsg: '',
        connected: false,
      },
      selectedPort: undefined as string | undefined,
      mock: {
        packet: [] as number[],
      },
    },
    clock: true,
    period: true,
    awayTeam: {
      score: true,
      football: {
        timeouts: true,
      },
      hockey: {
        faceoff: true,
        sog: true,
        penalty: true,
      },
    },
    homeTeam: {
      score: true,
      football: {
        timeouts: true,
      },
      hockey: {
        faceoff: true,
        sog: true,
        penalty: true,
      },
    },
    football: {
      downs: true,
      yardsToGo: true,
      possession: true,
      playClock: true,
    },
  },
};

export const defaultScoreboard = {
  offsetX: 0,
  offsetY: 0,
  clock: {
    time: 120_000, // 2 minutes in milliseconds
    isRunning: false,
  },
  announcement: [] as Announcement[],
  awayTeam: {
    announcement: [] as Announcement[],
    name: '',
    nameColor: '',
    nameSize: 0,
    logo: '',
    logoSize: 100,
    score: 0,
    scoreColor: '',
    scoreSize: 0,
    primaryColor: '',
    secondaryColor: '',
  },
  homeTeam: {
    announcement: [] as Announcement[],
    name: '',
    nameColor: '',
    nameSize: 0,
    logo: '',
    logoSize: 100,
    score: 0,
    scoreColor: '',
    scoreSize: 0,
    primaryColor: '',
    secondaryColor: '',
  },
  teamSwap: false, // Swaps the default team positions
  period: {
    count: 1,
    length: 3,
    overtime: {
      count: 0,
      length: 0,
    },
  },
  hockey: {
    shootout: {
      // Should the period count exceed its length + OT length, it will
      // be considered a shootout and the period will be rendered as S/O.
      enabled: false,
      round: 0,
    },
    awayTeam: {
      // The score is an array of booleans, where each boolean represents a goal scored in the shootout.
      score: [] as boolean[],
      penalty: {
        player1: {
          number: '',
          timer: '',
        },
        player2: {
          number: '',
          timer: '',
        },
      },
      sog: 0,
      faceoff: 0,
    },
    homeTeam: {
      // The score is an array of booleans, where each boolean represents a goal scored in the shootout.
      score: [] as boolean[],
      penalty: {
        player1: {
          number: '',
          timer: '',
        },
        player2: {
          number: '',
          timer: '',
        },
      },
      sog: 0,
      faceoff: 0,
    },
  },
  // We're in America
  football: {
    down: 1,
    yardsToGo: '10',
    possession: '',
    playClock: 0, // The initial value of the play clock
    playClockRunning: false, // Whether the play clock is currently running
    awayTeam: {
      timeouts: 3,
    },
    homeTeam: {
      timeouts: 3,
    },
  },
};

export const defaultFullscreen = {
  credits: {
    credit: [] as Credit[],
  },
  standings: {
    teams: [] as StandingsTeam[],
    title: '',
    subtitle: '',
    headerLogoLink: '',
  },
  custom: [] as CustomGraphic[],
};

export const defaultExternal = {
  awayTeam: {
    athleticsURL: '',
  },
  homeTeam: {
    athleticsURL: '',
  },
};

export class CustomGraphic {
  public _id: string;
  public offsetX = 0;
  public offsetY = 0;
  public preserveSize = false;
  public preserveRatio = true;
  // Width and height are percentages of the screen size (0-100)
  // They are only used if preserveSize and preserveRatio are both false
  public width = 100;
  public height = 100;
  // Size is a percentage scale (0-100) applied when preserveRatio is true and preserveSize is false
  public size = 100;
  public imagePath: string;

  public constructor(imagePath: string) {
    this._id = v4();
    this.imagePath = imagePath;
  }
}

export class Credit {
  public _id: string;
  public people: string[] = [];
  public peopleColor = '';
  public peopleSize = 0;
  public title = '';
  public titleColor = '';
  public titleSize = 0;

  public constructor() {
    this._id = v4();
  }
}

export class Channel {
  public bottomTextBar = false;
  public bottomGrayText = false;
  public bottomRedText = false;
  public bug = false;
  public commentators = false;
  public copyright = false;
  public endGraphic = false;
  public faceoff = false;
  public goToBreak = false;
  public locator = false;
  public playerBio = false;
  public produced = false;
  public scoreboard = false;
  public shootout = false;
  public sog = false;
  public standings = false;
  public credits = false;
  public custom: {
    id: string;
    show: boolean;
  }[] = [];

  public addCustomGraphic(id: string) {
    this.custom.push({
      id,
      show: false,
    });
  }

  public updateCustomGraphic(id: string, show: boolean) {
    const graphic = this.custom.find(g => g.id === id);
    if (graphic) {
      graphic.show = show;
    }
  }

  public deleteCustomGraphic(id: string) {
    this.custom = this.custom.filter(g => g.id !== id);
  }
}

export const defaultChannels: Channel[] = [new Channel()];

export const defaultReplicants = {
  lowerThird: defaultLowerThird,
  configuration: defaultConfiguration,
  scoreboard: defaultScoreboard,
  fullscreen: defaultFullscreen,
  external: defaultExternal,
  channels: defaultChannels,
};

export type LowerThird = typeof defaultLowerThird;
export type Configuration = typeof defaultConfiguration;
export type Scoreboard = typeof defaultScoreboard;
export type Fullscreen = typeof defaultFullscreen;
export type External = typeof defaultExternal;
export type Channels = typeof defaultChannels;
export type Replicants = typeof defaultReplicants;
