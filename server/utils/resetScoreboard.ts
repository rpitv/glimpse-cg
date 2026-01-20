import { replicants } from '~/utils/replicants';
import { defaultScoreboard } from '~/types/replicants';

export function resetScoreboard() {
  const scoreboard = replicants.scoreboard;
  scoreboard.announcement = defaultScoreboard.announcement;
  scoreboard.awayTeam.score = defaultScoreboard.awayTeam.score;
  scoreboard.awayTeam.announcement = defaultScoreboard.awayTeam.announcement;
  scoreboard.homeTeam.score = defaultScoreboard.homeTeam.score;
  scoreboard.homeTeam.announcement = defaultScoreboard.homeTeam.announcement;

  scoreboard.period.count = defaultScoreboard.period.count;
  scoreboard.period.length = defaultScoreboard.period.length;
  scoreboard.period.overtime.count = defaultScoreboard.period.overtime.count;
  scoreboard.period.overtime.length = defaultScoreboard.period.overtime.length;

  scoreboard.teamSwap = defaultScoreboard.teamSwap;

  scoreboard.clock.isRunning = defaultScoreboard.clock.isRunning;
  scoreboard.clock.time = defaultScoreboard.clock.time;

  scoreboard.football.awayTeam.timeouts = defaultScoreboard.football.awayTeam.timeouts;
  scoreboard.football.homeTeam.timeouts = defaultScoreboard.football.homeTeam.timeouts;
  scoreboard.football.possession = defaultScoreboard.football.possession;
  scoreboard.football.down = defaultScoreboard.football.down;
  scoreboard.football.yardsToGo = defaultScoreboard.football.yardsToGo;
  scoreboard.football.playClock = defaultScoreboard.football.playClock;
  scoreboard.football.playClockRunning = defaultScoreboard.football.playClockRunning;

  scoreboard.hockey.awayTeam.faceoff = defaultScoreboard.hockey.awayTeam.faceoff;
  scoreboard.hockey.awayTeam.penalty.player1.number = defaultScoreboard.hockey.awayTeam.penalty.player1.number;
  scoreboard.hockey.awayTeam.penalty.player1.timer = defaultScoreboard.hockey.awayTeam.penalty.player1.timer;
  scoreboard.hockey.awayTeam.penalty.player2.number = defaultScoreboard.hockey.awayTeam.penalty.player2.number;
  scoreboard.hockey.awayTeam.penalty.player2.timer = defaultScoreboard.hockey.awayTeam.penalty.player2.timer;
  scoreboard.hockey.awayTeam.score = defaultScoreboard.hockey.awayTeam.score;
  scoreboard.hockey.awayTeam.sog = defaultScoreboard.hockey.awayTeam.sog;
  scoreboard.hockey.homeTeam.faceoff = defaultScoreboard.hockey.homeTeam.faceoff;
  scoreboard.hockey.homeTeam.penalty.player1.number = defaultScoreboard.hockey.homeTeam.penalty.player1.number;
  scoreboard.hockey.homeTeam.penalty.player1.timer = defaultScoreboard.hockey.homeTeam.penalty.player1.timer;
  scoreboard.hockey.homeTeam.penalty.player2.number = defaultScoreboard.hockey.homeTeam.penalty.player2.number;
  scoreboard.hockey.homeTeam.penalty.player2.timer = defaultScoreboard.hockey.homeTeam.penalty.player2.timer;
  scoreboard.hockey.homeTeam.score = defaultScoreboard.hockey.homeTeam.score;
  scoreboard.hockey.homeTeam.sog = defaultScoreboard.hockey.homeTeam.sog;

}