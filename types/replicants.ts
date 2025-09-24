import type { Announcement } from "~/utils/announcement";
import type { StandingsTeam } from "~/utils/standings";
import { v4 } from "uuid";

export const defaultLowerThird = {
  bottomTextBar: {
    greyText: {
      text: "",
      alignment: 'center' as 'left' | 'center' | 'right',
      textSize: 0,
      offsetX: 0,
      offsetY: 0,
      textColor: '#FFFFFF',
      bgColor: '#000000'
    },
    redText: {
      text: "",
      alignment: "center" as 'left' | 'center' | 'right',
      textSize: 0,
      offsetX: 0,
      offsetY: 0,
      textColor: '#FFFFFF',
      autoResize: false
    }
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
    awayTeam : {
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
    homeTeam : {
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
    awayTeam : {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 100,
      logoColor: '',
      primaryColor: '',
      secondaryColor: '',
    },
    homeTeam : {
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
      hometown: ''
    }
  }
}

export class Commentator {
  public _id: string
  public name: string
  public nameColor: string
  public nameSize: number
  public description: string
  public descriptionColor: string
  public descriptionSize: number
  public constructor() {
    this._id = v4();
    this.name = "";
    this.nameColor = "";
    this.nameSize = 0;
    this.description = "";
    this.descriptionColor = "";
    this.descriptionSize = 0;
  }
}

export const defaultConfiguration = {
  style: 'rpitv' as 'rpitv' | 'espn' | 'football',
  // Based on the selected sport, it will attempt to fetch different data from athletics.
  sport: 'hockey' as 'hockey' | 'football' | 'acha' | 'lacrosse' |'basketball' | 'soccer',
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
    athletics: ''
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
    athletics: ''
  },
  sync: {
    awayTeam: {
      score: true,
      football: {
        downs: true,
        yardsToGo: true,
        possession: true,
        playClock: true,
      },
      hockey: {
        sog: true,
      }
    },
    homeTeam: {
      sog: true,
      score: true,
      football: {
        downs: true,
        yardsToGo: true,
        possession: true,
        playClock: true,
      },
      hockey: {
        sog: true,
      }
    }
  }
}

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
      length: 0
    }
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
          timer: ''
        },
        player2: {
          number: '',
          timer: ''
        }
      },
      sog: 0,
      faceoff: 0
    },
    homeTeam: {
      // The score is an array of booleans, where each boolean represents a goal scored in the shootout.
      score: [] as boolean[],
      penalty: {
        player1: {
          number: '',
          timer: ''
        },
        player2: {
          number: '',
          timer: ''
        }
      },
      sog: 0,
      faceoff: 0
    },
  },
  // We're in America
  football: {
    down: 1,
    yardsToGo: 10,
    possession: '',
    playClock: 0, // The initial value of the play clock
    playClockRunning: false, // Whether the play clock is currently running
    timeouts: 3
  }
}

export const defaultFullscreen = {
  credits: {
    credit: [] as Credit[],
  },
  standings: {
    teams: [] as StandingsTeam[],
    title: "",
    subtitle: "",
    headerLogoLink: "",
  },
  custom: [] as CustomGraphic[]
}

export const defaultExternal = {
  awayTeam: {
    athleticsURL: '',
  },
  homeTeam: {
    athleticsURL: '',
  }
}

interface CustomGraphic {
  name: string;
  offsetX: number;
  offsetY: number;
  imagePath: string;
}

export class Credit {
  public _id: string;
	public people: string[];
	public peopleColor: string;
	public peopleSize: number;
	public title: string;
	public titleColor: string;
	public titleSize: number;

	public constructor() {
    this._id = v4();
		this.people = [];
		this.peopleColor = "";
		this.peopleSize = 0;
		this.title = "";
		this.titleColor = "";
		this.titleSize = 0;
	}
}


export class Channel {
  public bottomTextBar: boolean;
  public bottomGrayText: boolean;
  public bottomRedText: boolean;
  public bug: boolean;
  public commentators: boolean;
  public copyright: boolean;
  public endGraphic: boolean;
  public goToBreak: boolean;
  public locator: boolean;
  public playerBio: boolean;
  public produced: boolean;
  public scoreboard: boolean;
  public shootout: boolean;
  public sog: boolean;
  public standings: boolean;
  public credits: boolean;
  public custom: boolean[];
  public constructor() {
    this.bottomTextBar = false;
    this.bottomGrayText = false;
    this.bottomRedText = false;
    this.bug = false;
    this.commentators = false;
    this.copyright = false;
    this.endGraphic = false;
    this.goToBreak = false;
    this.locator = false;
    this.playerBio = false;
    this.produced = false;
    this.scoreboard = false;
    this.shootout = false;
    this.sog = false;
    this.standings = false;
    this.credits = false;
    this.custom = [];
  }
  addCustomGraphic() {
    this.custom.push(false);
  }
  updateCustomGraphic(index: number) {
    this.custom[index] = false;
  }
  deleteCustomGraphic(index: number) {
    this.custom.splice(index, 1);
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
}

export type LowerThird = typeof defaultLowerThird;
export type Configuration = typeof defaultConfiguration;
export type Scoreboard = typeof defaultScoreboard;
export type Fullscreen = typeof defaultFullscreen;
export type External = typeof defaultExternal;
export type Channels = typeof defaultChannels;
export type Replicants = typeof defaultReplicants;