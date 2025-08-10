export const defaultLowerThird = {
  bug: {
    show: false,
    offsetX: 0,
    offsetY: 0,
  },
  commentators: {
    show: false,
    offsetX: 0,
    offsetY: 0,
    people: [] as Commentator[],
  },
  copyright: {
    show: false,
    offsetX: 0,
    offsetY: 0,
    text: `©${new Date().getFullYear()} RPI TV`,
    textColor: '#000000',
    textSize: 0,
  },
  goToBreak: {
    show: false,
    offsetX: 0,
    offsetY: 0,
    description: {
      clock: false,
      fontSize: 0,
      fontColor: '#000000',
      text: '',
    },
    awayTeam : {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 0,
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
      logoSize: 0,
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
    show: false,
    offsetX: 0,
    offsetY: 0,
    leftTeam : {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 0,
      logoColor: '',
      primaryColor: '',
      secondaryColor: '',
    },
    rightTeam : {
      name: '',
      nameColor: '',
      nameSize: 0,
      logo: '',
      logoSize: 0,
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
    offsetX: 0,
    offsetY: 0,
    show: false
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
}

export const defaultScoreboard = {
  show: false,
  offsetX: 0,
  offsetY: 0,
  clock: {
    time: '120_000', // 2 minutes in milliseconds
    isRunning: false,
  },
  awayTeam: {
    name: '',
    nameColor: '#000000',
    nameSize: 0,
    logo: '',
    logoSize: 0,
    score: 0,
    scoreColor: '#000000',
    scoreSize: 0,
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  homeTeam: {
    name: '',
    nameColor: '#000000',
    nameSize: 0,
    logo: '',
    logoSize: 0,
    score: 0,
    scoreColor: '#000000',
    scoreSize: 0,
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
      show: false,
      round: 0,
    },
    leftTeam: {
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
    rightTeam: {
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
    show: false
  },
  custom: [] as CustomGraphic[]
}

export const defaultExternal = {
  leftTeam: {
    athleticsURL: '',
  },
  rightTeam: {
    athleticsURL: '',
  }
}

interface CustomGraphic {
  name: string;
  show: boolean;
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
		this.peopleSize = 0;
		this.title = "";
		this.titleColor = "";
		this.titleSize = 0;
	}
}

export type LowerThird = typeof defaultLowerThird;
export type Configuration = typeof defaultConfiguration;
export type Scoreboard = typeof defaultScoreboard;
export type Fullscreen = typeof defaultFullscreen;
export type External = typeof defaultExternal;