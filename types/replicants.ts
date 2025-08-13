import type { Announcement } from "~/utils/announcement"
import type { StandingsTeam } from "~/utils/standings"

export const defaultLowerThird = {
  bottomTextBar: {
    greyText: {
      text: "",
      alignment: 'center' as 'left' | 'center' | 'right',
      textSize: 100,
      offsetX: 0,
      offsetY: 0,
      textColor: '#FFFFFF',
      bgColor: '#000000'
    },
    redText: {
      text: "",
      alignment: "center" as 'left' | 'center' | 'right',
      textSize: 100,
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
    textColor: '#000000',
    textSize: 100,
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
      fontColor: '#000000',
      text: '',
      autoFit: false,
    },
    awayTeam : {
      name: '',
      nameColor: '',
      nameSize: 100,
      logo: '',
      logoSize: 100,
      logoColor: '',
      score: 0,
      scoreColor: '',
      scoreSize: 100,
      primaryColor: '',
      secondaryColor: '',
    },
    homeTeam : {
      name: '',
      nameColor: '',
      nameSize: 100,
      logo: '',
      logoSize: 100,
      logoColor: '',
      score: 0,
      scoreColor: '',
      scoreSize: 100,
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
      nameSize: 100,
      logo: '',
      logoSize: 100,
      logoColor: '',
      primaryColor: '',
      secondaryColor: '',
    },
    homeTeam : {
      name: '',
      nameColor: '',
      nameSize: 100,
      logo: '',
      logoSize: 100,
      logoColor: '',
      primaryColor: '',
      secondaryColor: '',
    },
    location: {
      name: '',
      nameColor: '',
      nameSize: 100,
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
    teamside: 'awayTeam' as 'awayTeam' | 'homeTeam',
    offsetX: 0,
    offsetY: 0,
    height: 0,
    year: 0,
    weight: 0,
    hometown: ''
  }
}

interface Commentator {
  name: string
  nameColor: string
  nameSize: number
  description: string
  descriptionColor: string
  descriptionSize: number
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
    nameColor: '#000000',
    nameSize: 100,
    logo: '',
    logoSize: 100,
    score: 0,
    scoreColor: '#000000',
    scoreSize: 100,
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  homeTeam: {
    announcement: [] as Announcement[],
    name: '',
    nameColor: '#000000',
    nameSize: 100,
    logo: '',
    logoSize: 100,
    score: 0,
    scoreColor: '#000000',
    scoreSize: 100,
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
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
    playClock: 0,
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
	public people: string[];
	public peopleColor: string;
	public peopleSize: number;
	public title: string;
	public titleColor: string;
	public titleSize: number;

	public constructor() {
		this.people = [];
		this.peopleColor = "";
		this.peopleSize = 100;
		this.title = "";
		this.titleColor = "";
		this.titleSize = 100;
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

export const defaultChannels: Channel[] = [];

export type LowerThird = typeof defaultLowerThird;
export type Configuration = typeof defaultConfiguration;
export type Scoreboard = typeof defaultScoreboard;
export type Fullscreen = typeof defaultFullscreen;
export type External = typeof defaultExternal;
export type Channels = typeof defaultChannels;