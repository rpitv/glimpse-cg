<template>
  <div :class="'center'">
    <div class="scoreboard bordered">
      <div>
        <TeamView team="awayTeam" />
        <div
          v-if="powerplaySync.type === 'away'"
          class="announcement-section" :style="awayTeamClass"
        >
          <p>
            {{ powerplaySync.status }} {{ powerPlayClock }}
          </p>
        </div>
        <div
          v-if="scoreboard!.awayTeam.announcement.length > 0"
          class="announcement-section" :style="awayTeamClass"
        >
          <p>
            {{ computedMessage(scoreboard!.awayTeam.announcement[0]!).value }}
          </p>
        </div>
        <div
          v-if="channel[channelIndex]!.shootout"
          class="announcement-section" :style="awayTeamClass"
        >
          <p>
            <span v-for="shot of hockeyAwayTeam.score">
              {{ shot ? '✅' : '❌' }}
            </span>
          </p>
        </div>
      </div>
      <div class="bordered">
        <TeamView team="homeTeam" />
        <div
          v-if="powerplaySync.type === 'home'"
          class="announcement-section" :style="homeTeamClass"
        >
          <p>
            {{ powerplaySync.status }} {{ powerPlayClock }}
          </p>
        </div>
        <div
          v-if="scoreboard!.homeTeam.announcement.length > 0"
          class="announcement-section" :style="homeTeamClass"
        >
          <p>
            {{ computedMessage(scoreboard!.homeTeam.announcement[0]!).value }}
          </p>
        </div>
        <div
          v-if="channel![channelIndex]!.shootout"
          class="announcement-section" :style="homeTeamClass"
        >
          <p>
            <span v-for="shot of hockeyHomeTeam.score">
              {{ computedShot(shot) }}
            </span>
          </p>
        </div>
      </div>

      <div class="time-section bordered">
        <p class="period-section">
          {{ formattedPeriod }}
        </p>
        <hr>
        <div class="clock-section">
          <p>
            {{ formattedClockTime }}
          </p>
        </div>
        <div
          v-if="powerplaySync.type === 'global'"
          class="announcement-section global"
        >
          <p>
            {{ powerplaySync.status }} {{ powerPlayClock }}
          </p>
        </div>
        <div
          v-if="scoreboard!.announcement.length > 0"
          class="announcement-section global"
        >
          <p>
            {{ computedMessage(scoreboard!.announcement[0]!).value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import TeamView from './TeamView.vue';
import type { Announcement } from '~/utils/announcement';

const route = useRoute();
const replicants = await useReplicants();
const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channel = replicants.channels;
const scoreboard = replicants.scoreboard;
const hockeyAwayTeam = scoreboard.hockey.awayTeam;
const hockeyHomeTeam = scoreboard.hockey.homeTeam;
const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;
const clock = scoreboard.clock;
const period = scoreboard.period;

const formattedClockTime = computed<string>(() => {
  const minutes = Math.floor(clock.time / 60000).toString();
  let seconds = Math.floor((clock.time % 60000) / 1000).toString();
  const millis = Math.floor((clock.time % 1000) / 100).toString();
  if (minutes === '0') {
    return `${seconds}.${millis}`;
  }
  else {
    // noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
    seconds = seconds.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
});

const formattedPeriod = computed<string>(() => {
  if (period.count > period.length) {
    const overtimePeriod = period.count - period.length;
    if (period.count > period.overtime.length + period.length)
      return 'S/O';
    if (overtimePeriod === 1) {
      return 'OT';
    }
    else {
      return `OT${overtimePeriod}`;
    }
  }

  if (period.count === undefined) {
    return '1st';
  }

  // Teens for some reason all end in "th" in English.
  if (period.count > 10 && period.count < 20) {
    return period.count + 'th';
  }

  // For all other numbers up to 99, we need to figure out the suffix.
  const lastNumberOfPeriod = period.count % 10;
  if (lastNumberOfPeriod === 1) {
    return `${period.count}st`;
  }
  else if (lastNumberOfPeriod === 2) {
    return `${period.count}nd`;
  }
  else if (lastNumberOfPeriod === 3) {
    return `${period.count}rd`;
  }
  else {
    return `${period.count}th`;
  }
});

/*
Used to calculate whether white or black text should appear on announcements
Source: https://stackoverflow.com/a/41491220/4698546
 */
function pickTextColorBasedOnBgColorSimple(bgColor: string, lightColor: string, darkColor: string) {
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186)
    ? darkColor
    : lightColor;
}

const homeTeamTextColor = computed(() => pickTextColorBasedOnBgColorSimple(homeTeam.primaryColor, '#ffffff', '#000000'));
const awayTeamTextColor = computed(() => pickTextColorBasedOnBgColorSimple(awayTeam.primaryColor, '#ffffff', '#000000'));

const awayTeamClass = computed((): CSSProperties => 
  ({
    display: 'flex',
		alignItems: 'center',
		textAlign: 'left',
		paddingLeft: '0.5em',
		backgroundColor: awayTeam.primaryColor,
		color: awayTeamTextColor.value,
		width: '20.7vw',
		top: '5.4vh'
  })
);

const homeTeamClass = computed((): CSSProperties => 
  ({
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: '0.5em',
    backgroundColor: homeTeam.primaryColor,
    color: homeTeamTextColor.value,
    width: '20.7vw',
    top: '5.4vh'
  })
);

function computedMessage(message: Announcement) {
  return computed(() => {
    if (!message.timer || !message.timer.visible) {
      return message.message;
    }
    else {
      const timeRemaining = message.timer.length - (message.timer.startedAt - scoreboard.clock.time);

      const minutes = Math.max(0, Math.floor(timeRemaining / 60000)).toString();
      // noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
      const seconds = Math.max(0, Math.floor((timeRemaining % 60000) / 1000)).toString().padStart(2, '0');

      if (minutes === '0') {
        return message.message + ' :' + seconds;
      }
      else {
        return message.message + ' ' + minutes + ':' + seconds;
      }
    }
  });
}

function computedShot(shot: boolean | null) {
  if (shot === null) return '❔';
  return shot ? '✅' : '❌';
}

// POWERPLAY SYNC
const powerplaySync = computed(() => {
  // If two away players are on penalty...
  const powerplay = {
    status: '',
    type: '',
  };
  if (hockeyAwayTeam.penalty.player1.number && hockeyAwayTeam.penalty.player2.number) {
    // If two home players are on penalty
    if (hockeyHomeTeam.penalty.player1.number) {
      if (hockeyHomeTeam.penalty.player2.number) {
        powerplay.type = 'global';
        powerplay.status = '3 on 3';
      }
      else {
        powerplay.type = 'home';
        powerplay.status = '4 on 3';
      }
    }
    else {
      powerplay.type = 'home';
      powerplay.status = '5 on 3';
    }
  }
  // If two home players are on penalty...
  else if (hockeyHomeTeam.penalty.player1.number && hockeyHomeTeam.penalty.player2.number) {
    // If two away players are on penalty
    if (hockeyAwayTeam.penalty.player1.number) {
      if (hockeyAwayTeam.penalty.player2.number) {
        powerplay.type = 'global';
        powerplay.status = '3 on 3';
      }
      else {
        powerplay.type = 'away';
        powerplay.status = '4 on 3';
      }
    }
    else {
      powerplay.type = 'away';
      powerplay.status = '5 on 3';
    }
  }
  // If either away player is on a penalty...
  else if (hockeyAwayTeam.penalty.player1.number || hockeyAwayTeam.penalty.player2.number) {
    // If either home player is on a penalty...
    if (hockeyHomeTeam.penalty.player1.number || hockeyHomeTeam.penalty.player2.number) {
      powerplay.type = 'global';
      powerplay.status = '4 on 4';
    }
    else {
      powerplay.type = 'home';
      powerplay.status = 'Power Play';
    }
  }
  // If either home player is on a penalty...
  else if (hockeyHomeTeam.penalty.player1.number || hockeyHomeTeam.penalty.player2.number) {
    // If either away player is on a penalty...
    if (hockeyAwayTeam.penalty.player1.number || hockeyAwayTeam.penalty.player2.number) {
      powerplay.type = 'global';
      powerplay.status = '4 on 4';
    }
    else {
      powerplay.type = 'away';
      powerplay.status = 'Power Play';
    }
  }
  return powerplay;
});

const powerPlayClock = computed(() => {
  let smallestTime = '';
  const times = [hockeyHomeTeam.penalty.player1.timer, hockeyHomeTeam.penalty.player2.timer,
    hockeyAwayTeam.penalty.player1.timer, hockeyAwayTeam.penalty.player2.timer];

  for (const time of times) {
    if (!time)
      continue;
    if (!smallestTime) {
      smallestTime = time;
      continue;
    }
    // If the minutes of the "smallest time" is less than the minute of the time, ignore it
    if (smallestTime.split(':')[0]! < time.split(':')[0]!)
      continue;

    // If the minutes of the "smallest time" is equal to the minute of the time...
    if (smallestTime.split(':')[0] == time.split(':')[0]) {
      // If the seconds of the "smallest time" is less than the seconds of the time, ignore it
      if (smallestTime.split(':')[1]! < time.split(':')[1]! && smallestTime.split(':')[1] != '0')
        continue;
      smallestTime = time;
      continue;
    }
    smallestTime = time;
  }
  return smallestTime;
});
</script>

<style scoped lang="scss">
div {
	--scoreboard-height: 4.5vh;
	color: rgb(73,73,68);

}

.center {
	display: flex;
	justify-content: center;
	transition: opacity 1s;
}

.bordered {
	outline: rgb(157,154,136) 0.15vw solid;
}

.scoreboard {
	display: flex;
	justify-content: center;
	position: absolute;
	top: 6.1vh;
	height: var(--scoreboard-height);
	transition: opacity 1s;
}

.time-section {
	display: flex;
	align-items: center;
	font-family: 'Roboto', sans-serif;
	background-color: rgb(220, 220, 220);
	height: var(--scoreboard-height);

	hr {
		height: 50%;
		transform: translateY(50%);
		border: 0;
		border-right: rgb(157,154,136) 0.075vw solid;
	}

	.period-section, .clock-section {
		text-align: center;
	}

	.period-section {
		font-size: 1.5vw;
		width: 4.1vw;
	}
	.clock-section {
		font-size: 1.5vw;
		width: 5.9vw;
	}
}

.announcement-section {
	position: absolute;
	outline: rgb(157,154,136) 0.15vw solid;
	font-family: 'Roboto', sans-serif;
	font-size: 2.4vh;
	height: 4vh;

	&.global {
		background-color: rgb(241,229,76);
		color: rgb(99,87,24);
		width: 10.05vw;
		top: 5.4vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
